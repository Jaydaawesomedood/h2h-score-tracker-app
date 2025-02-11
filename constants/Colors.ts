/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const text = {
  light: "#11181c",
  dark: "#ecedee"
};

const tintColorLight = '#2f9e4e';
const tintColorDark = '#fff';
const primary = "#32a852";
const primaryDisabled = "#79a485";

const accentRed = "#d63131";
const grey = "#666";

const white = "#FFF";

export const Colors = {
  light: {
    text: text.light,
    textFlipped: text.dark,
    textDisabled: '#bbb',
    background: '#ebebeb',
    tabBarBackground: 'rgb(242, 242, 242)',
    tabBarBorder: "rgb(216, 216, 216)",
    primary: primary,
    primaryDisabled: "#91dba5",
    tabIconSelected: tintColorLight,
    secondaryBtn: primary,
    input: "#ccc",
    inputPlaceholder: "#818181",
    dropdownContainer: "#ddd",
    dropdownContainerDisabled: "#bbb",
    dropdownItemSelected: "#b9b9b9",
    itemSeparator: "#b1b1b1",
    deleteIcon: "#992420",
    cardBody: "#dadada",
    cardHeader: "#6dbf83",
    // TODO - change all values below
    winningTeamBorder: "#f5e642",
    accentRed: accentRed,
    grey: grey,
    white: white,
    lightgrey: "#8e8e8e",
    addPlayerBackground: "#2c406e",
    addTeamBackground: "#693007",
  },
  dark: {
    text: text.dark,
    textFlipped: text.light,
    textDisabled: '#5b5b5b',
    background: '#151718',
    tabBarBackground: 'rgb(18, 18, 18)',
    tabBarBorder: 'rgb(39, 39, 41)',
    primary: primary,
    primaryDisabled: primaryDisabled,
    tabIconSelected: tintColorDark,
    secondaryBtn: primary,
    input: "#303030",
    inputPlaceholder: "#7c7c7c",
    dropdownContainer: "#474747",
    dropdownContainerDisabled: "rgba(180, 180, 180, 0.2)",
    dropdownItemSelected: "#3b3b3b",
    itemSeparator: "#555",
    deleteIcon: "#bd2d28",
    cardBody: "#303030",
    cardHeader: "#427a51",
    winningTeamBorder: "#de9221",
    accentRed: accentRed,
    grey: grey,
    white: white,
    lightgrey: "#8e8e8e",
    addPlayerBackground: "#5d6f99",
    addTeamBackground: "#99895d",
  },
};
