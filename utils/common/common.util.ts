import { Categories } from "@/models/Categories.enum";
import { Match } from "@/models/Match";
import moment from "moment";

// MATCHES
function SortMatchesByDate(matches: Match[], category?: string) {
  matches = category ? matches.filter((match: Match) => match.category === category) : matches;

  // In descending order
  matches.sort((a: Match, b: Match) => {
    return moment(b.datetime, "DD MMM YYYY").toDate().valueOf() - moment(a.datetime, "DD MMM YYYY").toDate().valueOf();
  });

  return matches;
}

function GetWinRate(total: number, won: number) {
  return total ? ((won / total) * 100).toFixed(1) : "-"
};

// CATEGORIES
function GetUniqueCategoriesFromAllMatches(matches: Match[]) {
  return matches ? 
  [
    ...new Set(
      matches
      .filter((match: Match) => match.category.toLowerCase() !== Categories.Unspecified.toLowerCase())
      .map((match: Match) => match.category)
    )
  ] as string[]
  : [];
};

function GetCategoryFullName(category: string) {
  return Categories[category.toUpperCase() as keyof typeof Categories];
};

export {
  SortMatchesByDate,
  GetWinRate,
  GetUniqueCategoriesFromAllMatches,
  GetCategoryFullName
};