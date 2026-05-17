import { ProgressTrackerContext } from "@/contexts/ProgressTrackerContext";
import { useContext } from "react";

export default function useProgressTracker() {
  const context = useContext(ProgressTrackerContext);
  return context;
}