import { LogScoreContext } from "@/contexts/LogScoreContext";
import { useContext } from "react";

export function useLogScore() {
  const context = useContext(LogScoreContext);
  return context;
}