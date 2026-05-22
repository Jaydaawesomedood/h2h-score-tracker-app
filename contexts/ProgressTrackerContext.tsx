import { createContext } from "react";

type ProgressTrackerState = {
  current: number,
  onNext: () => void,
  onPrevious: () => void,
  isNextDisabled: boolean,
  checkIsNextDisabled: (data: any, ...conditions: (() => boolean)[]) => void,
}

export const ProgressTrackerContext = createContext<ProgressTrackerState>({
  current: 0,
  onNext: () => {},
  onPrevious: () => {},
  isNextDisabled: false,
  checkIsNextDisabled: () => {}
});