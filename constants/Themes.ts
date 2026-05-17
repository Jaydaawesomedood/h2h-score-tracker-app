import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { BLACK, LIGHT_GREY, PRIMARY, PRIMARY_DISABLED, WHITE } from "./Colors";

// Constants - Typography
const FONT_FAMILY = "LeagueSpartan";

type Theme =  ReactNavigation.Theme & {
  colors: {
    textDisabled: string,
    primaryDisabled: string,
  }
}

const LIGHT_THEME: Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY,
    primaryDisabled: PRIMARY_DISABLED,
    background: WHITE,
    card: "#f2f2f2",
    text: BLACK,
    textDisabled: LIGHT_GREY,
    border: "#d8d8d8",
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: `${FONT_FAMILY}Light`,
      fontWeight: "200"
    },
    medium: {
      fontFamily: `${FONT_FAMILY}Regular`,
      fontWeight: "400"
    },
    bold: {
      fontFamily: `${FONT_FAMILY}Bold`,
      fontWeight: "600"
    },
  }
};

const DARK_THEME: Theme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: PRIMARY,
    primaryDisabled: PRIMARY_DISABLED,
    background: "#151718",
    card: "#121212",
    text: WHITE,
    textDisabled: LIGHT_GREY,
    border: "#272729",
  },
  fonts: {
    ...DarkTheme.fonts,
    regular: {
      fontFamily: `${FONT_FAMILY}Light`,
      fontWeight: "200"
    },
    medium: {
      fontFamily: `${FONT_FAMILY}Regular`,
      fontWeight: "400"
    },
    bold: {
      fontFamily: `${FONT_FAMILY}Bold`,
      fontWeight: "600"
    },
  }
};

export { LIGHT_THEME, DARK_THEME }