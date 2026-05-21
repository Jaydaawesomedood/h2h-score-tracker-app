import { ProgressTrackerContext } from "@/contexts/ProgressTrackerContext";
import { useContext } from "react";

export default function useProgressTracker() {
  const context = useContext(ProgressTrackerContext);

  if (!context) {
    throw new Error("useProgressTracker must be used within a ProgressTrackerProvider");
  }

  return context;
}