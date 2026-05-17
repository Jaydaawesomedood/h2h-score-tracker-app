import { Theme } from "@/models/v2/Theme";

export const THEMES: { light: Theme, dark: Theme } = {
  light: {
    primary: "#32a852",
    primaryDisabled: "#79a485",
    background: "#ffffff",
    card: "#f2f2f2",
    text: "#000000",
    textDisabled: "#bbbbbb",
    border: '#d8d8d8',
    muted: '#8e8e8e',
    shade: "#666666",
    input: "#ccc",
    inputPlaceholder: "#818181",
    red: "#d63131",
  },
  dark: {
    primary: "#32a852",
    primaryDisabled: "#79a485",
    background: "#0b0b0b",
    card: "#151718",
    text: "#ffffff",
    textDisabled: "#bbbbbb",
    border: '#272729',
    muted: '#8e8e8e',
    shade: "#666666",
    input: "#303030",
    inputPlaceholder: "#7c7c7c",
    red: "#d63131",
  },
};