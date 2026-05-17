import { ProgressTrackerContext } from "@/contexts/ProgressTrackerContext";
import { ReactNode, useState } from "react";

export default function ProgressTrackerProvider({ children }: { children: ReactNode | undefined }) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const onNext = () => setCurrentStep(currentStep + 1);
  const onPrevious = () => setCurrentStep(currentStep - 1);

  return (
    <ProgressTrackerContext.Provider value={{ current: currentStep, onNext, onPrevious }}>
      {children}
    </ProgressTrackerContext.Provider>
  );
}