import { LogScoreContext } from "@/contexts/LogScoreContext";
import { useContext } from "react";

export function useLogScore() {
  const context = useContext(LogScoreContext);

  if (!context) {
    throw new Error("useLogScore must be used within a LogScoreProvider");
  }

  return context;
}