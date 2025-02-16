export const light = "LeagueSpartanLight";
export const regular = "LeagueSpartanRegular";
export const bold = "LeagueSpartanBold";

export const extraSmall = 12; // Very extra information (e.g., card footers)
export const small = 14; // Alert messages
export const medium = 16; // Regular content, inputs, secondary buttons
export const large = 20; // Primary buttons
export const mainContent = 26; // Important content
export const title = 32; // Screen titles
export const extraLarge = 40; // Banner headings

const headerStyle = {
  fontFamily: bold,
  fontSize: large,
  lineHeight: large,
};

const contentStyle = {
  fontFamily: regular,
  fontSize: medium,
  lineHeight: medium,
};

export const TextStyles = {
  titles: {
    screen: {
      fontFamily: bold,
      fontSize: title,
      lineHeight: title
    },
    section: {
      ...headerStyle,
    },
    subsection: {
      fontFamily: bold,
      fontSize: medium,
      lineHeight: medium,
    },
  },
  descriptions: {
    small: {
      fontFamily: light,
      fontSize: small,
      lineHeight: small,
    },
    medium: {
      fontFamily: light,
      fontSize: medium,
      lineHeight: medium,
    }
  },
  content: {
    main: {
      ...contentStyle
    },
  },
  controls: {
    input: {
      form: {
        ...contentStyle
      },
      label: {
        ...contentStyle,
        marginBottom: 8,
      },
    },
    buttons: {
      primary: {
        ...headerStyle
      },
    },
  },
};