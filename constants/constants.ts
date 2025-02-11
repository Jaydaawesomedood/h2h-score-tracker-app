export const Steps = {
  AddMatch: [
    { label: "Match" },
    { label: "Players" },
    { label: "Score" },
  ],
  EditMatch: [
    { label: "Match" },
    { label: "Score" }
  ],
};

export const AdvancedSearch = {
  participants: {
    type :[
      { value: "all", label: "All", icon: "account-group" },
      { value: "players", label: "Players", icon: "account" },
      { value: "teams", label: "Teams", icon: "account-supervisor" },
    ],
    gender: [
      { value: "all", label: "All", icon: "human-male-female" },
      { value: "male", label: "Male", icon: "gender-male" },
      { value: "female", label: "Female", icon: "gender-female" },
    ],
    teamCategory: [
      { value: "all", label: "All" },
      { value: "md", label: "MD" },
      { value: "wd", label: "WD" },
      { value: "xd", label: "XD" },
    ],
  },
  matches: {
    category: [
      { value: "all", label: "All" },
      { value: "ms", label: "MS" },
      { value: "ws", label: "WS" },
      { value: "md", label: "MD" },
      { value: "wd", label: "WD" },
      { value: "xd", label: "XD" },
    ],
    mode: [
      { value: "all", label: "All", icon: "view-list" },
      { value: "casual", label: "Casual Games", icon: "shoe-sneaker" },
      { value: "tournament", label: "Tournaments", icon: "trophy" },
    ],
    timeframe: [
      { value: "all time", label: "All-Time" },
      { value: "this year", label: "This Year" },
    ],
    criteria: [
      { value: "date", label: "Date" },
    ],
  },
  sortOrder: [
    { value: "ascending", label: "Ascending", icon: "sort-reverse-variant" },
    { value: "descending", label: "Descending", icon: "sort-variant" },
  ],
};