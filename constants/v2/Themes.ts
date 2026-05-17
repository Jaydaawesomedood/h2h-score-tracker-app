import { Theme } from "@/models/v2/Theme";
import { BLACK, GREY, LIGHT_GREY, PRIMARY, PRIMARY_DISABLED, WHITE } from "../Colors";

export const THEMES: { light: Theme, dark: Theme } = {
  light: {
    primary: PRIMARY,
    primaryDisabled: PRIMARY_DISABLED,
    background: WHITE,
    card: "#f2f2f2",
    text: BLACK,
    textDisabled: LIGHT_GREY,
    border: '#d8d8d8',
    muted: '#8e8e8e',
    shade: GREY,
    input: "#ccc",
    inputPlaceholder: "#818181",
    red: "#d63131",
  },
  dark: {
    primary: PRIMARY,
    primaryDisabled: PRIMARY_DISABLED,
    background: "#0b0b0b",
    card: "#151718",
    text: WHITE,
    textDisabled: LIGHT_GREY,
    border: '#272729',
    muted: '#8e8e8e',
    shade: GREY,
    input: "#303030",
    inputPlaceholder: "#7c7c7c",
    red: "#d63131",
  },
};