import {AccuracySelector} from "@app/components/ui/AccuracySelector";
import {useState} from "react";

export const useAccuracySelector = (from: number, to: number, step = 0.001) => {
  const [value, setValue] = useState(from);

  const element = AccuracySelector({from, to, value, step, setter: setValue});

  return {value, element};
};
