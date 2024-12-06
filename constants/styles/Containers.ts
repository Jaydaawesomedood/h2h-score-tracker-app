import { Dimensions, StyleProp, TextStyle, ViewStyle } from "react-native";

export const BorderDebug: ViewStyle = {
  borderColor: "red",
  borderStyle: "solid",
  borderWidth: 1,
};

function calculateDimension(dimension: "width" | "height", smValue: number, lgValue: number) {
  return Dimensions.get('window')[dimension] * (Dimensions.get('window')[dimension] > 900 ? lgValue : smValue);
}

// TODO - Refactor all these
export const Containers: { [key: string]: ViewStyle } = {
  screen: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: calculateDimension("height", 0.05, 0.075),
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: calculateDimension("height", 0.002, 0.004),
    marginBottom: 24,
  },
  listItem: {
    alignContent: "center",
    flexDirection: "row",
    paddingVertical: 16,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
};

export const Dropdown: { [key: string]: ViewStyle & TextStyle } = {
  input: {
    borderWidth: 0,
  },
  inputText: {
    paddingHorizontal: 0,
  },
};

export const PlayerListItem: { [key: string]: ViewStyle } = {
  itemContainer: {
    alignItems: "center",
    columnGap: 20,
    flexDirection: "row",
    paddingVertical: 16,
  },
  teamTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
  },
};

export const PlayerBanner: { [key: string]: ViewStyle } = {
  bannerContainer: {
    flex: 1,
  },
  innerBannerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingTop: calculateDimension("height", 0.05, 0.07),
  },
  screenTitleContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: 32,
  },
  bannerContentContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    columnGap: 20,
    flexDirection: "row",
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  titleContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
};

export const Modals: { [key: string]: ViewStyle } = {
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    height: "100%",
    width: "100%",
  },
  content: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: 0,
    height: "40%",
    paddingHorizontal: 32,
    position: "absolute",
    width: "100%",
  },
  contentFull: {
    borderRadius: 16,
    marginHorizontal: 32,
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 24,
  },
  bodyContainer: {},
};

export const AddOption: { [key: string]: ViewStyle } = {
  container: {
    alignItems: "center",
    borderRadius: 16,
    columnGap: 8,
    flexDirection: "row",
    paddingVertical: 16,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
};

export const AddTeamPlayer: { [key: string]: ViewStyle } = {
  container: {
    // alignItems: "center",
    borderColor: "grey",
    borderRadius: 8,
    borderStyle: "dotted",
    borderWidth: 4,
    justifyContent: "center",
    minHeight: 100,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  placeholderContainer: {
    alignItems: "center",
    columnGap: 8,
    flexDirection: "row",
    justifyContent: "center",

  },
};