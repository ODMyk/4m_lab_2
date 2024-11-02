import {matrix} from "@app/mock/hauss";
import {detByGauss, inverseByGauss, solveGauss} from "@app/utils";
import styles from "./style.module.scss";
import {Matrix} from "../../Matrix";
import {Button} from "@app/components/core/Button";
import {useCallback, useEffect, useMemo, useState} from "react";

export const HaussTab = () => {
  const result = useMemo(() => solveGauss(matrix), [matrix]);
  const inverse = useMemo(() => inverseByGauss(result.steps), [result]);
  const steps = useMemo(() => result.steps ?? [], [result]);
  const permCount = useMemo(
    () => steps.filter((s) => s.operationType === "permutation").length,
    [],
  );
  const detResult = useMemo(() => detByGauss(result.steps), [result]);

  const lastStep = useMemo(() => (result.steps.length ?? 1) - 1, [result]);

  const [step, setStep] = useState(lastStep);

  useEffect(() => setStep(lastStep), [lastStep]);

  const handleNextStep = useCallback(
    () =>
      setStep((prev) =>
        prev + 1 < (result.steps.length ?? -1) ? prev + 1 : prev,
      ),
    [lastStep],
  );

  const handlePrevStep = useCallback(
    () => setStep((prev) => (prev > 0 ? prev - 1 : prev)),
    [],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <p className={styles.header}>Метод Гаусса</p>
      </div>
      <div className={styles.conditionContainer}>
        <p>A</p>
        <p>=</p>
        <Matrix matrix={matrix} />
        <div className={styles.separator} style={{margin: "0 24px"}} />
        <p>
          A{result.solution ? "" : " не"} виконує умову збіжності методу Гаусса,
          тому {result.solution ? "" : " не"}можливо знайти розвʼязок.
        </p>
      </div>
      {result.solution && (
        <>
          <div className={styles.conditionContainer}>
            <div className={styles.conditionContainer}>
              <div className={styles.counter}>
                <Button
                  onPress={handleNextStep}
                  disabled={!(step + 1 < result.steps.length)}
                >
                  +
                </Button>
                <p>{step}-й</p>
                <Button onPress={handlePrevStep} disabled={step === 0}>
                  -
                </Button>
              </div>
              <p>крок</p>
            </div>
            <div className={styles.separator} style={{margin: "0 24px"}} />
            <div className={styles.conditionContainer}>
              <Matrix
                matrix={steps[Math.min(step, steps.length - 1)].matrixState}
              />
              <div className={styles.separator} style={{margin: "0 24px"}} />
              <Matrix matrix={inverse[Math.min(step, steps.length - 1)]} />
              <div className={styles.separator} style={{margin: "0 24px"}} />
              {steps[Math.min(step, steps.length - 1)].operationMatrix ? (
                <Matrix
                  matrix={
                    steps[Math.min(step, steps.length - 1)].operationMatrix!
                  }
                />
              ) : (
                <div className={styles.conditionContainer}>
                  <p>Дія відсутня</p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.conditionContainer}>
            <p>
              Було виконано {permCount} перестановок, тому det(A) ={" "}
              {permCount % 2 ? "-(" : ""}
              {detResult.multipliers.join(" x ")}
              {permCount % 2 ? ")" : ""} = {detResult.det}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
