import React, { createContext } from "react";

type LogScore = {
  type: 'singles' | 'doubles' | undefined,
  date: string,
  setType: React.Dispatch<React.SetStateAction<'singles' | 'doubles' | undefined>>,
  setDate: React.Dispatch<React.SetStateAction<string>>,
};

export const LogScoreContext = createContext<LogScore>({
  type: undefined,
  date: '',
  setType: () => {},
  setDate: () => {}
});