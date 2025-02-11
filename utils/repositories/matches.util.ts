import { Match } from "@/models/Match";
import moment from "moment";

function FilterMatches(filters: any, matches: { singles: Match[], doubles: Match[] }) {
  if (filters["category"] && filters["mode"] && filters["timeframe"]) {
    let result: { singles: Match[], doubles: Match[] } = { singles: [], doubles: [] };

    for (let j = 0; j < Object.keys(matches).length; j++) {
      const key = Object.keys(matches)[j] as "singles" | "doubles";
      const currentMatches = Object.values(matches)[j];
      let filteredMatches: Match[] = [];
  
      for (let i = 0; i < currentMatches.length; i++) {
        const match = currentMatches[i];
        
        if (
          (filters["category"] === "all" || filters["category"] === match.category.toLowerCase()) &&
          (filters["mode"] === "all" || filters["mode"] === match.mode.toLowerCase()) &&
          (filters["timeframe"] === "all time" || moment(match.datetime, "DD MMM YYYY").year() === moment().year())
        ) {
          filteredMatches.push(match);
        }
      }

      result[key] = filteredMatches;
    }

    if (filters["sortOrder"]) {
      if (filters["sortOrder"] === "descending") {
        result.singles = result.singles.sort((a, b) => moment(b.datetime, "DD MMM YYYY").toDate().getTime() - moment(a.datetime, "DD MMM YYYY").toDate().getTime())
        result.doubles = result.doubles.sort((a, b) => moment(b.datetime, "DD MMM YYYY").toDate().getTime() - moment(a.datetime, "DD MMM YYYY").toDate().getTime())
      }
      else if (filters["sortOrder"] === "ascending") {
        result.singles = result.singles.sort((a, b) => moment(a.datetime, "DD MMM YYYY").toDate().getTime() - moment(b.datetime, "DD MMM YYYY").toDate().getTime())
        result.doubles = result.doubles.sort((a, b) => moment(a.datetime, "DD MMM YYYY").toDate().getTime() - moment(b.datetime, "DD MMM YYYY").toDate().getTime())
      }
    }

    return result;
  }

  return matches;
};

export {
  FilterMatches,
};