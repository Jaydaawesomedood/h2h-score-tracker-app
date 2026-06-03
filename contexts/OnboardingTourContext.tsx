import { createContext } from "react";

export type StepMeta = {
  name: string,
  title: string,
  description: string,
  order: number,
  onNextStep?: () => void,
}

export type StepCoords = {
  x: number,
  y: number,
  width: number,
  height: number,
  // r: number,
}

export type OnboardingStep = StepMeta & Partial<StepCoords>;

type OnboardingTourContext = {
  activeStep: number | null,
  activeStepName: string | null,
  steps: Record<string, OnboardingStep>,
  updateStepCoords: (name: string, coords: StepCoords) => void,
  nextStep: () => void,
  startTour: () => void,
}

export const OnboardingTourContext = createContext<OnboardingTourContext>({
  activeStep: null,
  activeStepName: null,
  steps: {},
  updateStepCoords: () => {},
  nextStep: () => {},
  startTour: () => {},
});