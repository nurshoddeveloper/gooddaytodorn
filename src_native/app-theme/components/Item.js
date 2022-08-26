// @flow

import { Platform } from "react-native";

import variable from "./../variables/platform";

export default (variables = variable) => {
  const itemTheme = {
    ".floatingLabel": {
      "NativeBase.Input": {
        height: 50,
        top: 8,
        paddingTop: 3,
        paddingBottom: 7,
        ".multiline": {
          minHeight: variables.inputHeightBase,
          paddingTop: Platform.OS === "ios" ? 10 : 3,
          paddingBottom: Platform.OS === "ios" ? 14 : 10
        }
      },
      "NativeBase.Label": {
        paddingTop: 5
      },
      "NativeBase.Icon": {
        top: 6,
        paddingTop: 8
      },
      "NativeBase.IconNB": {
        top: 6,
        paddingTop: 8
      }
    },
    ".fixedLabel": {
      "NativeBase.Label": {
        position: null,
        top: null,
        left: null,
        right: null,
        flex: 1,
        height: null,
        width: null,
        fontSize: variables.inputFontSize
      },
      "NativeBase.Input": {
        flex: 2,
        fontSize: variables.inputFontSize
      }
    },
    ".stackedLabel": {
      "NativeBase.Label": {
        position: null,
        top: null,
        left: null,
        right: null,
        paddingTop: 5,
        alignSelf: "flex-start",
        fontSize: variables.inputFontSize - 2
      },
      "NativeBase.Icon": {
        marginTop: 36
      },
      "NativeBase.Input": {
        alignSelf: Platform.OS === "ios" ? "stretch" : "flex-start",
        flex: 1,
        width: Platform.OS === "ios" ? null : variables.deviceWidth - 25,
        fontSize: variables.inputFontSize,
        lineHeight: variables.inputLineHeight - 6,
        ".secureTextEntry": {
          fontSize: variables.inputFontSize - 4
        },
        ".multiline": {
          paddingTop: Platform.OS === "ios" ? 9 : undefined,
          paddingBottom: Platform.OS === "ios" ? 9 : undefined
        }
      },
      flexDirection: null,
      minHeight: variables.inputHeightBase + 15
    },
    ".inlineLabel": {
      "NativeBase.Label": {
        position: null,
        top: null,
        left: null,
        right: null,
        paddingRight: 20,
        height: null,
        width: null,
        fontSize: variables.inputFontSize
      },
      "NativeBase.Input": {
        paddingLeft: 5,
        fontSize: variables.inputFontSize
      },
      flexDirection: "row"
    },
    "NativeBase.Label": {
      fontSize: variables.inputFontSize,
      color: variables.inputColorPlaceholder,
      paddingRight: 5
    },
    "NativeBase.Icon": {
      fontSize: 24,
      paddingRight: 8
    },
    "NativeBase.IconNB": {
      fontSize: 24,
      paddingRight: 8
    },
    "NativeBase.Input": {
      ".multiline": {
        height: null
      },
      height: variables.inputHeightBase,
      color: variables.inputColor,
      flex: 1,
      top: Platform.OS === "ios" ? 1.5 : undefined,
      fontSize: variables.inputFontSize
    },
    ".underline": {
      "NativeBase.Input": {
        paddingLeft: 15
      },
      ".success": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".error": {
        borderColor: variables.inputErrorBorderColor
      },
      borderWidth: variables.borderWidth * 2,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderColor: variables.inputBorderColor
    },
    ".regular": {
      "NativeBase.Input": {
        paddingLeft: 8
      },
      "NativeBase.Icon": {
        paddingLeft: 10
      },
      ".success": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".error": {
        borderColor: variables.inputErrorBorderColor
      },
      borderWidth: variables.borderWidth * 2,
      borderColor: variables.inputBorderColor
    },
    ".rounded": {
      "NativeBase.Input": {
        paddingLeft: 8
      },
      "NativeBase.Icon": {
        paddingLeft: 10
      },
      ".success": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".error": {
        borderColor: variables.inputErrorBorderColor
      },
      borderWidth: variables.borderWidth * 2,
      borderRadius: 30,
      borderColor: variables.inputBorderColor
    },

    ".success": {
      "NativeBase.Icon": {
        color: variables.inputSuccessBorderColor
      },
      "NativeBase.IconNB": {
        color: variables.inputSuccessBorderColor
      },
      ".rounded": {
        borderRadius: 30,
        borderColor: variables.inputSuccessBorderColor
      },
      ".regular": {
        borderColor: variables.inputSuccessBorderColor
      },
      ".underline": {
        borderWidth: variables.borderWidth * 2,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: variables.inputSuccessBorderColor
      },
      borderColor: variables.inputSuccessBorderColor
    },

    ".error": {
      "NativeBase.Icon": {
        color: variables.inputErrorBorderColor
      },
      "NativeBase.IconNB": {
        color: variables.inputErrorBorderColor
      },
      ".rounded": {
        borderRadius: 30,
        borderColor: variables.inputErrorBorderColor
      },
      ".regular": {
        borderColor: variables.inputErrorBorderColor
      },
      ".underline": {
        borderWidth: variables.borderWidth * 2,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: variables.inputErrorBorderColor
      },
      borderColor: variables.inputErrorBorderColor
    },
    ".disabled": {
      "NativeBase.Icon": {
        color: "#384850"
      },
      "NativeBase.IconNB": {
        color: "#384850"
      }
    },
    ".picker": {
      marginLeft: 0
    },

    '.line-projects-users': {
      'NativeBase.Button': {
        marginRight: 10
      },
      'NativeBase.Thumbnail': {
        marginRight: 10
      },
      margin: 0,
      marginTop: 5, // to be with the same margin as button in create/reply forms
      borderWidth: 0
    },
    '.column-recent-projects': {
      'NativeBase.Button': {
        marginRight: 10,
        marginBottom: 20,
      },
      flexDirection: 'column',
      marginTop: 10,
      borderWidth: 0
    },

    '.error-create-task': {
      'NativeBase.Text': {
        color: variable.brandDanger,
        fontSize: variable.fontSizeBase - 2
      },
      borderWidth: 0
    },

    '.task-title-icon': {
      'NativeBase.Text': {
        color: variable.inverseTextColor,
        marginLeft: 0,
      },
      borderWidth: 0,
    },
    '.task-title-number-holder': {
      borderWidth: 0,
      position: 'absolute',
      top: 3,
      right: 10,
      zIndex: 2,
    },
    '.task-title-number': {
      'NativeBase.Text': {
        '.ttn-hash': {
          color: variable.inverseTextColor,
          opacity: 0.7,
        },
        '.ttn-number': {
          color: variable.inverseTextColor,
          marginLeft: 1
        },
        fontSize: 12,
      },
      borderWidth: 0,
      borderRadius: 11,
      height: 22,
      paddingHorizontal: 6,
      backgroundColor: variables.androidRippleColorDark
    },

    '.task-control-item': {
      'NativeBase.Text': {
        '.header': {
          color: variables.textGrayColor,
          fontSize: 12,
        },
      },
      marginLeft: 0,
      marginVertical: 10,
      paddingLeft: variables.listItemPadding,
      borderWidth: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },

    '.project-control-item': {
      'NativeBase.Text': {
        '.header': {
          color: variables.textGrayColor,
          fontSize: 12,
        },
      },
      marginVertical: 10,
      marginLeft: 10,
      borderWidth: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },


    borderWidth: variables.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: variables.inputBorderColor,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 2,

    '.task-view-pending': {
      borderWidth: 0,
      'NativeBase.Left': {},
      'NativeBase.Body': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: variables.listItemPadding,
        'NativeBase.Text': {
          padding: 0,
          fontSize: variables.fontSizeBase - 4,
          color: variables.textGrayColor,
          '.username': {
            color: variables.textColor
          }
        }
      }
    },

    '.activityStreamTaskMessage': {
      'NativeBase.Left': {
        flex: 0,
        margin: 0,
        padding: 0,
        marginLeft: variables.listItemPadding,

        width: 40,
        height: 36,
        //borderWidth: 1,
        //borderColor: 'blue',

        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
      },
      'NativeBase.Body': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: variables.listItemPadding,
        flex: 1,
        //borderWidth: 1,
        //borderColor: 'blue',
      },
      alignItems: 'flex-start',
      alignContent: 'flex-start',
      justifyContent: 'flex-start',
      borderWidth: 0,
    }
  };

  return itemTheme;
};
