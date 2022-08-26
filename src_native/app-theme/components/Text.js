// @flow

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    ".note": {
      color: "#a7a7a7",
      fontSize: variables.noteFontSize
    },
    '.gd-icon': {
      fontFamily: 'gd-icons',
    },
    '.glisp-icon-arrow': {
      fontFamily: 'gd-icons',
      height: 40,
      width: 40,
      color: variables.iconGeneralColor,
      fontSize: 14,
      lineHeight: variables.platform == 'ios' ? 38 : 40,
      textAlign: 'right',
      paddingRight: 12,
    },
    '.glisp-project-icon': {
      marginTop: 0,
      marginRight: 9,
      color: variables.textGrayColor,
      fontSize: 18,
    },
    '.glisp-project-name': {
      color: variables.textMessageColor,
      fontSize: 18,
    },
    '.glisp-project-name-selected': {
      color: '#000000',
      fontWeight: 'bold'
    },
    '.gd-event-icon': {
      color: variables.textGrayColor,
    },
    '.gd-schedule-past': {
      color: variables.schedulePastColor
    },
    '.asl-section-title': {
      color: '#363d4f',
      fontSize: 17,
      fontWeight: '200',
      paddingHorizontal: variables.listItemPadding,
      paddingTop: variables.listItemPadding,
    },
    '.asli-glisp-project-icon': {
      fontFamily: 'gd-icons',
      marginTop: 0,
      marginRight: 9,
      color: variables.textGrayColor,
      fontSize: 18,
    },
  };

  return textTheme;
};
