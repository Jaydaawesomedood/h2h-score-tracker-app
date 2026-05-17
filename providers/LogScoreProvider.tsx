import { LogScoreContext } from "@/contexts/LogScoreContext";
import moment from "moment";
import { useState } from "react";

export default function LogScoreProvider({ children }: { children: React.ReactNode | undefined }) {
  const [type, setType] = useState<'singles' | 'doubles' | undefined>(undefined);
  const [date, setDate] = useState<string>(moment().format("DD/MM/YYYY"));

  return (
    <LogScoreContext.Provider value={{ type, date, setType, setDate }}>
      {children}
    </LogScoreContext.Provider>
  );
}