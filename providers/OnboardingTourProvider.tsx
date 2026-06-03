import { ONBOARDING_STEPS } from "@/constants/v2/OnboardingSteps";
import { OnboardingStep, OnboardingTourContext, StepCoords } from "@/contexts/OnboardingTourContext";
import { useCallback, useState } from "react";

export default function OnboardingTourProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<Record<string, OnboardingStep>>(ONBOARDING_STEPS);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Sort steps by their ordered value to determine the sequence
  const getOrderedSteps = useCallback(() => {
    return Object.values(steps).sort((a, b) => a.order - b.order);
  }, [steps]);

  const orderedSteps = getOrderedSteps();
  const activeStepName = activeStep !== null ? orderedSteps[activeStep]?.name : null;

  // Called by components to report their coordinates on-demand
  const updateStepCoords = useCallback((name: string, coords: StepCoords) => {
    const adjustedCoords = name.endsWith('tab') ? { 
      ...coords,
      y: coords.y + coords.height / 2 + 8
    }
    : {
      ...coords,
      x: coords.x - 16,
      y: coords.y + coords.height - 8,
      width: coords.width + 32,
      height: coords.height + 16,
    };

    setSteps((prev) => ({
      ...prev,
      [name]: { ...prev[name], ...adjustedCoords },
    }));
  }, []);

  const nextStep = () => {
    if (activeStep !== null && activeStep < orderedSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
    else {
      setActiveStep(null); // End of tour
    }
  };

  const startTour = () => setActiveStep(0);
  
  return (
    <OnboardingTourContext.Provider
      value={{ activeStep, activeStepName, steps, updateStepCoords, nextStep, startTour }}
    >
      {children}
    </OnboardingTourContext.Provider>
  );
}