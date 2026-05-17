import { createContext } from "react";

type ProgressTrackerState = {
  current: number,
  onNext: () => void,
  onPrevious: () => void,
}

export const ProgressTrackerContext = createContext<ProgressTrackerState>({ current: 0, onNext: () => {}, onPrevious: () => {} });