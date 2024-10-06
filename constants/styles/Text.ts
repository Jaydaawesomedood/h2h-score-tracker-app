import { Platform, TextStyle } from "react-native";

export const light = "LeagueSpartanLight";
export const regular = "LeagueSpartanRegular";
export const bold = "LeagueSpartanBold";

export const extraSmall = 12; // Very extra information (e.g., card footers)
export const small = 14; // Alert messages
export const medium = 16; // Regular content, inputs, secondary buttons
export const large = 20; // Primary buttons
export const title = 32; // Screen titles
export const extraLarge = 40; // Banner headings

function getDimensionValue() {
  return Platform.OS === 'android' ? 8 : 12;
};

export const Text = {
  title: {
    section: {
      fontFamily: bold,
      fontSize: large,
      lineHeight: large,
    },
  },
  bottomTabLabel: {
    fontFamily: regular
  },
  topTabLabel: {
    fontFamily: regular,
    fontSize: medium,
    lineHeight: medium,
    textTransform: "none",
  },
  screenTitle: {
    fontFamily: bold,
    fontSize: title,
    lineHeight: title
  },
  primaryBtnTitle: {
    fontFamily: bold,
    fontSize: large,
    lineHeight: large,
  },
  secondaryBtnTitle: {
    fontFamily: regular,
    fontSize: medium,
    lineHeight: medium,
    marginLeft: 6,
  },
  input: {
    borderRadius: 8,
    fontFamily: regular,
    fontSize: medium,
    lineHeight: medium,
    paddingHorizontal: 8,
    paddingVertical: getDimensionValue(),
  },
  inputLabel: {
    fontFamily: regular,
    fontSize: medium,
    lineHeight: medium,
    marginBottom: 8,
  },
  addTeamPlayerInput: {
    fontFamily: light,
    fontSize: medium,
    lineHeight: medium,
  },
  message: {
    fontFamily: light,
    fontSize: small,
    lineHeight: small,
  },
  listItem: {
    fontFamily: regular,
    fontSize: medium,
    lineHeight: medium,
  },
  listSubtitle: {
    fontFamily: light,
    fontSize: small,
    lineHeight: small,
  },
  playerDetailsTitle: {
    fontFamily: regular,
    fontSize: title,
    lineHeight: title,
    paddingVertical: 4,
  },
  playerDetailsTitleBold: {
    fontFamily: bold,
    fontSize: extraLarge,
    lineHeight: extraLarge,
    paddingVertical: 4,
  },
  teamPlayerDetailsTitle: {
    fontFamily: regular,
    fontSize: large,
    // paddingVertical: 4,
  },
  teamPlayerDetailsTitleBold: {
    fontFamily: bold,
    fontSize: large,
    // paddingVertical: 4,
  },
  matchSummaryCard: {
    header: {
      fontFamily: bold,
      fontSize: medium,
    },
    footer: {
      fontFamily: light,
      fontSize: extraSmall,
    },
  },
};