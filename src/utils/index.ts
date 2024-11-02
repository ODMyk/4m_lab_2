export type Matrix = {
  size: number;
  rows: number[][];
};

export type Step = {
  operationType?: "permutation" | "scaling" | "elimination";
  operationMatrix?: Matrix;
  matrixState: Matrix;
};

export type GaussResult = {
  steps: Step[];
  solution: number[] | null;
};

export const createIdentityMatrix = (size: number): Matrix => ({
  size,
  rows: Array.from({length: size}).map((_, i) =>
    Array.from({length: size}).map((_, j) => (i === j ? 1 : 0)),
  ),
});

export const inverseByGauss = (steps: Step[]): Matrix[] => {
  const size = steps[0].matrixState.size;
  let matrix = createIdentityMatrix(size);
  const inverseSteps = [matrix];

  for (const op of steps.slice(1).map((s) => s.operationMatrix)) {
    matrix = multiplyMatrices(op!, matrix);
    inverseSteps.push(matrix);
  }

  return inverseSteps;
};

export const multiplyMatrices = (mat1: Matrix, mat2: Matrix): Matrix => {
  const result: Matrix = {
    size: mat1.size,
    rows: Array.from({length: mat1.size}, () =>
      Array(mat2.rows[0].length).fill(0),
    ),
  };
  for (let i = 0; i < mat1.size; i++) {
    for (let j = 0; j < mat2.rows[0].length; j++) {
      for (let k = 0; k < mat2.size; k++) {
        result.rows[i][j] += mat1.rows[i][k] * mat2.rows[k][j];
      }
    }
  }
  return result;
};

const createPermutationMatrix = (
  size: number,
  i: number,
  j: number,
): Matrix => {
  const permutationMatrix: Matrix = {
    size,
    rows: Array.from({length: size}, (_, rowIndex) =>
      Array.from({length: size}, (_, colIndex) =>
        rowIndex === colIndex ? 1 : 0,
      ),
    ),
  };
  [permutationMatrix.rows[i], permutationMatrix.rows[j]] = [
    permutationMatrix.rows[j],
    permutationMatrix.rows[i],
  ];
  return permutationMatrix;
};

const createScalingMatrix = (
  size: number,
  i: number,
  factor: number,
): Matrix => {
  const scalingMatrix: Matrix = {
    size,
    rows: Array.from({length: size}, (_, rowIndex) =>
      Array.from({length: size}, (_, colIndex) =>
        rowIndex === colIndex ? 1 : 0,
      ),
    ),
  };
  scalingMatrix.rows[i][i] = factor;
  return scalingMatrix;
};

const createEliminationMatrix = (
  size: number,
  i: number,
  j: number,
  factor: number,
): Matrix => {
  const eliminationMatrix: Matrix = {
    size,
    rows: Array.from({length: size}, (_, rowIndex) =>
      Array.from({length: size}, (_, colIndex) =>
        rowIndex === colIndex ? 1 : 0,
      ),
    ),
  };
  eliminationMatrix.rows[j][i] = -factor;
  return eliminationMatrix;
};

export const solveGauss = (matrix: Matrix): GaussResult => {
  const n = matrix.size;
  let a: Matrix = {size: n, rows: matrix.rows.map((row) => row.slice())};
  const steps: Step[] = [];
  steps.push({matrixState: matrix});

  for (let k = 0; k < n; k++) {
    let maxRow = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(a.rows[i][k]) > Math.abs(a.rows[maxRow][k])) {
        maxRow = i;
      }
    }

    if (maxRow !== k) {
      const permutationMatrix = createPermutationMatrix(n, k, maxRow);
      a = multiplyMatrices(permutationMatrix, a);
      steps.push({
        operationType: "permutation",
        operationMatrix: permutationMatrix,
        matrixState: {size: n, rows: a.rows.map((row) => row.slice())},
      });
    }

    const scalingMatrix = createScalingMatrix(n, k, 1 / a.rows[k][k]);
    a = multiplyMatrices(scalingMatrix, a);
    steps.push({
      operationType: "scaling",
      operationMatrix: scalingMatrix,
      matrixState: {size: n, rows: a.rows.map((row) => row.slice())},
    });

    for (let i = k + 1; i < n; i++) {
      const factor = a.rows[i][k];
      const eliminationMatrix = createEliminationMatrix(n, k, i, factor);
      a = multiplyMatrices(eliminationMatrix, a);
      steps.push({
        operationType: "elimination",
        operationMatrix: eliminationMatrix,
        matrixState: {size: n, rows: a.rows.map((row) => row.slice())},
      });
    }
  }

  for (let k = n - 1; k >= 0; k--) {
    for (let i = k - 1; i >= 0; i--) {
      const factor = a.rows[i][k];
      const eliminationMatrix = createIdentityMatrix(n);
      eliminationMatrix.rows[i][k] = -factor;
      a = multiplyMatrices(eliminationMatrix, a);
      steps.push({
        matrixState: a,
        operationMatrix: eliminationMatrix,
        operationType: "elimination",
      });
    }
  }

  const x: number[] = Array.from({length: n}).map((_, i) => a.rows[i][n]);

  return {
    steps,
    solution: x,
  };
};

export const detByGauss = (
  steps: Step[],
): {det: number; multipliers: number[]} => {
  const permCount = steps.filter(
    (s) => s.operationType === "permutation",
  ).length;
  const size = steps[0].matrixState.size;
  let det = permCount % 2 ? -1 : 1;

  let index = 0;
  const multipliers = [];
  for (let i = 0; i < size; ++i) {
    while (steps[index].operationType !== "scaling") {
      ++index;
    }
    const el = steps[index++ - 1].matrixState.rows[i][i];
    multipliers.push(el);
    det *= el;
  }

  return {det, multipliers};
};

export const det = ({size, rows: m}: Matrix): number => {
  if (size === 1) return m[0][0];

  let d = 0;
  let sign = 1;
  for (let i = 0; i < size; ++i) {
    const rows = m
      .slice()
      .map((r) => r.slice())
      .slice(1);
    rows.map((r) => r.splice(i, 1));

    d += sign * m[0][i] * det({size: size - 1, rows});
    sign = -sign;
  }

  return d;
};

export const minor = ({size, rows: m}: Matrix, order: number): number => {
  if (order < 1) return NaN;
  const rows = m
    .slice()
    .map((r) => r.slice())
    .slice(0, size);
  rows.splice(order, size - order);

  return det({size: order, rows});
};

export const isSimetric = ({size, rows: m}: Matrix): boolean => {
  for (let i = 0; i < size; ++i) {
    for (let j = i + 1; j < size; ++j) {
      if (m[i][j] !== m[j][i]) return false;
    }
  }
  return true;
};

export const isPositiveDefined = (m: Matrix) => {
  for (let i = 1; i <= m.size; ++i) {
    if (minor(m, i) < 0) return false;
  }
  return true;
};

export const checkSeidel = (m: Matrix) => {
  const symetric = isSimetric(m);
  const positive = isPositiveDefined(m);
  const supremacy = isDiagonalSupremacy(m);

  return {
    success: (symetric && positive) || supremacy,
    symetric,
    positive,
    supremacy,
  };
};

export const isDiagonalSupremacy = ({size, rows: m}: Matrix) => {
  for (let i = 0; i < size; ++i) {
    let sum = 0;
    const el = m[i][i];
    for (let j = 0; j < size; ++j) {
      if (j === i) continue;
      sum += Math.abs(m[i][j]);
    }
    if (sum > el) return false;
  }
  return true;
};

export const vectorNorm = (v: number[]) => {
  return Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));
};

export const calculateSeidel = (m: Matrix, b: number[], accuracy: number) => {
  const checkResult = checkSeidel(m);
  if (!checkResult.success) {
    return {
      isSuccess: false,
      checkState: {
        symetric: checkResult.symetric,
        positive: checkResult.positive,
        supremacy: checkResult.supremacy,
      },
      solution: null,
    };
  }
  let schema = m.rows.slice().map((r) => r.slice());
  schema.map((_, i) => schema[i].splice(i, 1, 0));
  b.map((v, i) => schema[i].splice(m.size, 0, -v));
  schema = schema.map((r, i) => r.map((el) => -el / m.rows[i][i]));

  let prev = Array.from({length: m.size}).map((_) => 0);
  const steps = [prev];
  let cur = prev;

  while (true) {
    cur = cur.map((_v, i) => {
      return schema[i].reduce(
        (acc, val, ind) => acc + val * (prev[ind] ?? 1),
        0,
      );
    });
    steps.push(cur);
    if (vectorNorm(cur.map((v, i) => v - prev[i])) <= accuracy) {
      break;
    }
    prev = cur;
  }

  return {
    isSuccess: true,
    checkState: {
      symetric: checkResult.symetric,
      positive: checkResult.positive,
      supremacy: checkResult.supremacy,
    },
    solution: {schema, steps},
  };
};

export const is3Diadonal = (m: Matrix) => {
  for (let i = 0; i < m.size; ++i) {
    for (let j = 0; j < m.size; ++j) {
      const check =
        i === j ||
        (i !== 0 && i === j + 1) ||
        (i + 1 !== m.size && i === j - 1);
      if ((m.rows[i][j] !== 0) !== check) {
        return false;
      }
    }
  }
  return true;
};

export const calculateProg = (m: Matrix, f_minus: number[]) => {
  const isAppliable = is3Diadonal(m);
  if (!isAppliable) {
    return {isSuccess: false, solution: null};
  }
  const a = m.rows.map((r, i) => (i === 0 ? 0 : r[i - 1]));
  const b = m.rows.map((r, i) => (i === m.size - 1 ? 0 : r[i + 1]));
  const c = m.rows.map((r, i) => -r[i]);
  const f = f_minus.map((f) => -f);
  const z = [];
  const alpha = [0];
  const beta = [0];

  for (let i = 0; i < m.size - 1; ++i) {
    z.push(c[i] - alpha[i] * a[i]);
    alpha.push(b[i] / z[i]);
    beta.push((f[i] + a[i] * beta[i]) / z[i]);
  }

  z.push(c[m.size - 1] - alpha[alpha.length - 1] * a[m.size - 1]);

  const solution = Array.from({length: m.size - 1}).map(() => 0);
  solution.push(
    (f[m.size - 1] + a[m.size - 1] * beta[m.size - 1]) / z[m.size - 1],
  );

  for (let i = m.size - 2; i >= 0; --i) {
    solution[i] = alpha[i + 1] * solution[i + 1] + beta[i + 1];
  }

  return {
    solution: {
      x: solution,
      alpha: alpha.slice(1),
      beta: beta.slice(1),
      z: z.slice(1),
    },
    isSuccess: true,
  };
};
