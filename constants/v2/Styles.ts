import { ViewStyle } from "react-native";

// Common styles
export const Styles: { [key: string]: ViewStyle } = {
  SCREEN_BODY: {
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  FLEX_HORIZONTAL_SIDE: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  FLEX_HORIZONTAL_CENTER: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  FLEX_COLUMN: {
    display: 'flex',
    flexDirection: 'column',
  }
}