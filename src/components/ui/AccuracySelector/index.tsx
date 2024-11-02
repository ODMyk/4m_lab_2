import {useCallback, useState} from "react";
import styles from "./styles.module.scss";

interface AccuracySelectorProps {
  from: number;
  to: number;
  value: number;
  setter: (newValue: number) => void;
  step?: number;
}

export function AccuracySelector({
  from,
  setter,
  to,
  value,
  step,
}: AccuracySelectorProps) {
  const [tempValue, setTempValue] = useState(value);
  const handleMoving = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setTempValue(Number(e.currentTarget.value)),
    [],
  );
  const handleStop = useCallback(() => setter(tempValue), [tempValue]);

  return (
    <div className={styles.container}>
      <input
        type="range"
        min={from}
        max={to}
        step={step}
        onChange={handleMoving}
        onMouseUp={handleStop}
        value={tempValue}
      />
      <span>{tempValue}</span>
    </div>
  );
}
