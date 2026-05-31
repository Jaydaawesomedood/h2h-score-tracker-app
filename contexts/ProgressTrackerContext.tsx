import React, { createContext, SetStateAction } from "react";

type ProgressTrackerState = {
  current: number,
  totalSteps: number,
  onNext: () => void,
  onPrevious: () => void,
  isNextDisabled: boolean,
  checkIsNextDisabled: (data: any, ...conditions: (() => boolean)[]) => void,
  setTotalSteps: React.Dispatch<SetStateAction<number>>,
}

export const ProgressTrackerContext = createContext<ProgressTrackerState>({
  current: 0,
  totalSteps: 0,
  onNext: () => {},
  onPrevious: () => {},
  isNextDisabled: false,
  checkIsNextDisabled: () => {},
  setTotalSteps: () => {},
});