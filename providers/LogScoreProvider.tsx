import { LogScoreContext } from "@/contexts/LogScoreContext";
import { Player } from "@/models/v2/data/Player";
import moment from "moment";
import { useState } from "react";

export default function LogScoreProvider({ children }: { children: React.ReactNode | undefined }) {
  const [type, setType] = useState<'singles' | 'doubles' | undefined>(undefined);
  const [date, setDate] = useState<string>(moment().format("DD/MM/YYYY"));
  const [sideA, setSideA] = useState<Player[]>([]);
  const [sideB, setSideB] = useState<Player[]>([]);
  const [sets, setSets] = useState<number[][]>([[]]);

  return (
    <LogScoreContext.Provider value={{ type, date, setType, setDate, sideA, sideB, setSideA, setSideB, sets, setSets }}>
      {children}
    </LogScoreContext.Provider>
  );
}