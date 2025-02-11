import { Match } from "@/models/Match";
import moment from "moment";

function SortMatchesByDate(matches: Match[], category?: string) {
  matches = category ? matches.filter((match: Match) => match.category === category) : matches;

  // In descending order
  matches.sort((a: Match, b: Match) => {
    return moment(b.datetime, "DD MMM YYYY").toDate().valueOf() - moment(a.datetime, "DD MMM YYYY").toDate().valueOf();
  });

  return matches;
}

function GetWinRate(total: number, value: number) {
  return total ? ((value / total) * 100).toFixed(1) : "-"
};

export {
  SortMatchesByDate,
  GetWinRate,
};