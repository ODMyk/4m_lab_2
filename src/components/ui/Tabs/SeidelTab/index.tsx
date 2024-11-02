import {calculateSeidel} from "@app/utils";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Matrix} from "@components/ui/Matrix";

import styles from "./style.module.scss";
import {Button} from "@app/components/core/Button";
import {b, matrix} from "@app/mock/seidel";
import {useAccuracySelector} from "@app/hooks/useAccuracySelector";

export const SeidelTab = () => {
  const {value: accuracy, element: AccuracySelector} = useAccuracySelector(
    0.001,
    0.2,
    0.002,
  );

  const result = useMemo(
    () => calculateSeidel(matrix, b, accuracy),
    [matrix, b, accuracy],
  );

  const lastStep = useMemo(
    () => (result.solution?.steps.length ?? 1) - 1,
    [result],
  );

  const [step, setStep] = useState(lastStep);

  useEffect(() => setStep(lastStep), [lastStep]);
  const steps = useMemo(() => result.solution?.steps ?? [], [result, accuracy]);

  const handleNextStep = useCallback(
    () =>
      setStep((prev) =>
        prev + 1 < (result.solution?.steps.length ?? -1) ? prev + 1 : prev,
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
        <p className={styles.header}>Метод Зейделя</p>
        <div className={styles.accuracyContainer}>
          <span>Epsilon:</span>
          {AccuracySelector}
        </div>
      </div>
      <div className={styles.conditionContainer}>
        <p>A</p>
        <p>=</p>
        <Matrix matrix={matrix} />
        <div className={styles.separator} />
        <Matrix matrix={{size: b.length, rows: b.map((x) => [x])}} />
        <div className={styles.separator} style={{margin: "0 24px"}} />
        <p>
          A{result.isSuccess ? "" : " не"} виконує умову збіжності методу
          Зейделя, тому {result.isSuccess ? "" : " не"}можливо знайти розвʼязок.
        </p>
      </div>
      {result.solution && (
        <>
          <div className={styles.conditionContainer}>
            <div>
              {result.solution.schema.map((r, i) => {
                let str = r
                  .map((v, ind) =>
                    !!v ? `${v > 0 ? "+" : "-"} ${Math.abs(v)}X${ind}` : "",
                  )
                  .filter((s) => !!s)
                  .join(" ");
                if (str.startsWith("+")) {
                  str = str.slice(2);
                } else {
                  str = "-" + str.slice(2);
                }
                return (
                  <p>
                    X{i} = {str}
                  </p>
                );
              })}
            </div>
          </div>
          <div className={styles.conditionContainer}>
            <div className={styles.conditionContainer}>
              <div className={styles.counter}>
                <Button
                  onPress={handleNextStep}
                  disabled={!(step + 1 < result.solution.steps.length)}
                >
                  +
                </Button>
                <p>{step}-й</p>
                <Button onPress={handlePrevStep} disabled={step === 0}>
                  -
                </Button>
              </div>
              <p>крок наближення</p>
            </div>
            <div className={styles.separator} style={{margin: "0 24px"}} />
            <div>
              {steps[Math.min(step, steps.length - 1)].map((v, i) => (
                <p>{`X${i} = ${v}`}</p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
