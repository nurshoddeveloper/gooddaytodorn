// @flow

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const badgeTheme = {
    ".primary": {
      backgroundColor: variables.btnPrimaryBg
    },
    ".warning": {
      backgroundColor: variables.btnWarningBg
    },
    ".info": {
      backgroundColor: variables.btnInfoBg
    },
    ".success": {
      backgroundColor: variables.btnSuccessBg
    },
    ".danger": {
      backgroundColor: variables.btnDangerBg
    },
    "NativeBase.Text": {
      color: variables.badgeColor,
      fontSize: variables.fontSizeBase,
      lineHeight: variables.lineHeight - 1,
      textAlign: "center",
      paddingHorizontal: 3
    },
    ".project-icon": {
      "NativeBase.Text": {
        lineHeight: variables.platform == 'ios' ? 30 : 34,
        textAlign: "center",
        padding: 0
      },
      height: 36,
      width: 36,
      borderRadius: 0,
      backgroundColor: variables.iconUserBg
    },
    ".user-icon": {
      "NativeBase.Text": {
        lineHeight: variables.platform == 'ios' ? 30 : 34,
        textAlign: "center",
        padding: 0
      },
      height: 36,
      width: 36,
      borderRadius: 18,
      backgroundColor: variables.iconUserBg
    },
    ".task-type-icon": {
      "NativeBase.Text": {
        fontFamily: "gd-task-icons",
        color: variables.iconTaskTypeColor,
        fontSize: variables.iconTaskTypeFontSize,
        lineHeight: variables.platform == 'ios' ? 32 : 36,
        textAlign: "center",
        padding: 0,
        backgroundColor: 'transparent'
      },
      height: 36,
      width: 36,
      borderRadius: 18,
      backgroundColor: variables.iconTaskTypeBg,
    },
    ".task-type-icon-selected": {
      "NativeBase.Text": {
        color: variables.iconTaskTypeSelectedColor,
      },
      backgroundColor: variables.iconTaskTypeSelectedBg
    },
    ".task-type-icon-in-header": {
      "NativeBase.Text": {
        color: variables.inverseTextColor,
        lineHeight: variables.platform == 'ios' ? 21 : 25,
      },
      height: 26,
      width: 26,
      alignItems: 'flex-start',
      borderRadius: 0,
      backgroundColor: 'transparent',
      padding: 0,
      margin:0,
    },
    ".task-type-icon-in-list": {
      "NativeBase.Text": {
        color: variables.iconGeneralColor,
        lineHeight: variables.platform == 'ios' ? 19 : 23,
      },
      height: 26,
      width: 26,
      alignContent: 'center',
      borderRadius: 0,
      backgroundColor: 'transparent',
      padding: 0,
      margin: 0
    },
    ".task-status-icon": {
      width: 12,
      height: 12,
      borderRadius: 1,
      padding: 0,
    },
    ".task-status-icon-tiny": {
      width: 6,
      height: 6,
      borderRadius: 1,
      padding: 0,
      margin: 0,
      marginRight: 4,
      marginTop: variables.platform == 'ios' ? 5 : 6,
    },
    ".task-status-icon-normal": {
      width: 36,
      height: 36,
      borderRadius: 1,
      padding: 0,
    },
    ".task-priority-icon": {
      width: 12,
      height: 12,
      borderRadius: 6,
      padding: 0,
    },
    ".task-priority-icon-tiny": {
      width: 6,
      height: 6,
      borderRadius: 3,
      padding: 0,
      margin: 0,
      marginRight: 4,
      marginTop: variables.platform == 'ios' ? 5 : 6,
    },
    ".event-status": {
      borderRadius: 3,
    },
    backgroundColor: variables.badgeBg,
    padding: variables.badgePadding,
    paddingHorizontal: 6,
    alignSelf: "flex-start",
    justifyContent: variables.platform === "ios" ? "center" : undefined,
    borderRadius: 13.5,
    height: 27
  };
  return badgeTheme;
};
