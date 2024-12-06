/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const primaryColorDark = "#32a852";
const primaryColorDisabledDark = "#79a485";

const accentRed = "#d63131";
const accentBlue = "#3170d6";

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    primary: primaryColorDark, // TODO: Change this
    primaryDisabled: primaryColorDisabledDark, // TODO: Change this
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    secondaryBtn: primaryColorDark, // TODO: Change this
    input: "#888", // TODO: Change this
    inputPlaceholder: "#a0a0a0", // TODO: Change this
    dropdownContainer: "#666", // TODO - Change this
    dropdownContainerDisabled: "#444", // TODO - Change this
    dropdownItemSelected: "#3b3b3b", // TODO - Change this
    itemSeparator: "#666", // TODO - Change this,
    deleteIcon: "#992420",
    cardBody: "#fff", // TODO - Change this
    cardHeader: "#fff", // TODO - Change this
    winningTeamBorder: "#f5e642",
    accentRed: accentRed,
    accentBlue: accentBlue,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    primary: primaryColorDark,
    primaryDisabled: primaryColorDisabledDark,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    secondaryBtn: primaryColorDark,
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
    accentBlue: accentBlue,
  },
};
