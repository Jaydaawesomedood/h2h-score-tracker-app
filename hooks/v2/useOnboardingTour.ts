import { OnboardingTourContext } from "@/contexts/OnboardingTourContext";
import { useContext } from "react";

export function useOnboardingTour() {
  return useContext(OnboardingTourContext);
}