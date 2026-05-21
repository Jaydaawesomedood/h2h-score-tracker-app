import { ProgressTrackerContext } from "@/contexts/ProgressTrackerContext";
import { ReactNode, useState } from "react";

export default function ProgressTrackerProvider({ children }: { children: ReactNode | undefined }) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false);
  const onNext = () => setCurrentStep(currentStep + 1);
  const onPrevious = () => setCurrentStep(currentStep - 1);

  const checkIsNextDisabled = (data: any) => {
    let disabled = false;

    Object.values(data).forEach(value => {
      if (typeof value === 'string' && value.trim() === '') disabled = true;
      if (Array.isArray(value) && value.length === 0) disabled = true;
      if (value === undefined || value === null) disabled = true;
    });

    setIsNextDisabled(disabled);
  }


  return (
    <ProgressTrackerContext.Provider value={{ current: currentStep, onNext, onPrevious, isNextDisabled, checkIsNextDisabled }}>
      {children}
    </ProgressTrackerContext.Provider>
  );
}