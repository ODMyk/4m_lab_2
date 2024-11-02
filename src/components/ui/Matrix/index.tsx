import {Matrix as MatrixType} from "@app/utils";
import styles from "./styles.module.scss";

interface MatrixProps {
  matrix: MatrixType;
}

export const Matrix = ({matrix}: MatrixProps) => {
  return (
    <div className={styles.wrapper}>
      {matrix.rows.map((r, ind) => (
        <div className={styles.row} key={`r[${ind}]`}>
          {r.map((v, i) => (
            <div key={`c[${ind}][${i}]`}>
              <span>{Math.round(v * 100) / 100}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
