import {b, matrix} from "@app/mock/prog";
import {calculateProg} from "@app/utils";
import {Matrix} from "@app/components/ui/Matrix";
import {useMemo} from "react";
import styles from "./styles.module.scss";

export const ProgTab = () => {
  const result = useMemo(() => calculateProg(matrix, b), []);

  return (
    <div className={styles.wrapper}>
      <p className={styles.header}>Метод Прогонки</p>
      <div className={styles.conditionContainer}>
        <p>A</p>
        <p>=</p>
        <Matrix matrix={matrix} />
        <div className={styles.separator} />
        <Matrix matrix={{size: b.length, rows: b.map((x) => [x])}} />
        <div className={styles.separator} style={{margin: "0 24px"}} />
        <p>
          A{result.isSuccess ? "" : " не"} є тридіагональною, тому{" "}
          {result.isSuccess ? "" : " не"}можливо знайти розвʼязок.
        </p>
      </div>
      {result.solution && (
        <>
          <div className={styles.conditionContainer}>
            <div>
              {result.solution.alpha.map((v, i) => (
                <p>{`Alpha${i + 1} = ${v}`}</p>
              ))}
            </div>
            <div className={styles.separator} style={{margin: "0 24px"}} />
            <div>
              {result.solution.beta.map((v, i) => (
                <p>{`Beta${i + 1} = ${v}`}</p>
              ))}
            </div>
            <div className={styles.separator} style={{margin: "0 24px"}} />
            <div>
              {result.solution.z.map((v, i) => (
                <p>{`Z${i + 1} = ${v}`}</p>
              ))}
            </div>
            <div className={styles.separator} style={{margin: "0 24px"}} />
            <div>
              {result.solution.x.map((v, i) => (
                <p>{`X${i} = ${v}`}</p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
