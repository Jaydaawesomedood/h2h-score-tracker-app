import { Categories } from "@/models/Categories.enum";
import { Match } from "@/models/Match";

// Get all unique categories from a list of matches provided
function GetUniqueCategoriesFromMatches(matches: Match[]) {
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

// Get full name of category by key
function GetCategoryFullName(category: string) {
  return Categories[category.toUpperCase() as keyof typeof Categories];
};

export {
  GetUniqueCategoriesFromMatches,
  GetCategoryFullName,
};
