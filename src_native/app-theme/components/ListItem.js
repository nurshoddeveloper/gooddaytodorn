// @flow

import { Platform, PixelRatio } from "react-native";

import pickerTheme from "./Picker";
import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const platform = variables.platform;
  const selectedStyle = {
    "NativeBase.Text": {
      color: variables.listItemSelected
    },
    "NativeBase.Icon": {
      color: variables.listItemSelected
    }
  };

  const listItemTheme = {
    "NativeBase.InputGroup": {
      "NativeBase.Icon": {
        paddingRight: 5
      },
      "NativeBase.IconNB": {
        paddingRight: 5
      },
      "NativeBase.Input": {
        paddingHorizontal: 5
      },
      flex: 1,
      borderWidth: null,
      margin: -10,
      borderBottomColor: "transparent"
    },
    ".searchBar": {
      "NativeBase.Item": {
        "NativeBase.Icon": {
          backgroundColor: "transparent",
          color: variables.dropdownLinkColor,
          fontSize:
            platform === "ios"
              ? variables.iconFontSize - 10
              : variables.iconFontSize - 5,
          alignItems: "center",
          marginTop: 2,
          paddingRight: 8
        },
        "NativeBase.IconNB": {
          backgroundColor: "transparent",
          color: null,
          alignSelf: "center"
        },
        "NativeBase.Input": {
          alignSelf: "center"
        },
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "flex-start",
        flex: 1,
        height: platform === "ios" ? 30 : 40,
        borderColor: "transparent",
        backgroundColor: "#fff",
        borderRadius: 5
      },
      "NativeBase.Button": {
        ".transparent": {
          "NativeBase.Text": {
            fontWeight: "500"
          },
          paddingHorizontal: null,
          paddingLeft: platform === "ios" ? 10 : null
        },
        paddingHorizontal: platform === "ios" ? undefined : null,
        width: platform === "ios" ? undefined : 0,
        height: platform === "ios" ? undefined : 0
      },
      backgroundColor: variables.toolbarInputColor,
      padding: 10,
      marginLeft: null
    },
    "NativeBase.CheckBox": {
      marginLeft: -10,
      marginRight: 10
    },
    ".first": {
      ".itemHeader": {
        paddingTop: variables.listItemPadding + 3
      }
    },
    ".itemHeader": {
      ".first": {
        paddingTop: variables.listItemPadding + 3
      },
      borderBottomWidth: platform === "ios" ? variables.borderWidth : null,
      marginLeft: null,
      padding: variables.listItemPadding,
      paddingLeft: variables.listItemPadding + 5,
      paddingTop:
        platform === "ios" ? variables.listItemPadding + 25 : undefined,
      paddingBottom:
        platform === "android" ? variables.listItemPadding + 20 : undefined,
      flexDirection: "row",
      borderColor: variables.listBorderColor,
      "NativeBase.Text": {
        fontSize: 14,
        color: platform === "ios" ? undefined : variables.listNoteColor
      }
    },
    ".itemDivider": {
      borderBottomWidth: null,
      marginLeft: null,
      padding: variables.listItemPadding,
      paddingLeft: variables.listItemPadding + 5,
      backgroundColor: variables.listDividerBg,
      flexDirection: "row",
      borderColor: variables.listBorderColor
    },
    ".selected": {
      "NativeBase.Left": {
        ...selectedStyle
      },
      "NativeBase.Body": {
        ...selectedStyle
      },
      "NativeBase.Right": {
        ...selectedStyle
      },
      ...selectedStyle
    },
    "NativeBase.Left": {
      "NativeBase.Body": {
        "NativeBase.Text": {
          ".note": {
            color: variables.listNoteColor,
            fontWeight: "200"
          },
          fontWeight: "600"
        },
        marginLeft: 10,
        alignItems: null,
        alignSelf: null
      },
      "NativeBase.Icon": {
        width: variables.iconFontSize - 10,
        fontSize: variables.iconFontSize - 10
      },
      "NativeBase.IconNB": {
        width: variables.iconFontSize - 10,
        fontSize: variables.iconFontSize - 10
      },
      "NativeBase.Text": {
        alignSelf: "center"
      },
      flexDirection: "row"
    },
    "NativeBase.Body": {
      "NativeBase.Text": {
        marginHorizontal: variables.listItemPadding,
        ".note": {
          color: variables.listNoteColor,
          fontWeight: "200"
        }
      },
      alignSelf: null,
      alignItems: null
    },
    "NativeBase.Right": {
      "NativeBase.Badge": {
        alignSelf: null
      },
      "NativeBase.PickerNB": {
        "NativeBase.Button": {
          marginRight: -15,
          "NativeBase.Text": {
            color: variables.topTabBarActiveTextColor
          }
        }
      },
      "NativeBase.Button": {
        alignSelf: null,
        ".transparent": {
          "NativeBase.Text": {
            color: variables.topTabBarActiveTextColor
          }
        }
      },
      "NativeBase.Icon": {
        alignSelf: null,
        fontSize: variables.iconFontSize - 8,
        color: "#c9c8cd"
      },
      "NativeBase.IconNB": {
        alignSelf: null,
        fontSize: variables.iconFontSize - 8,
        color: "#c9c8cd"
      },
      "NativeBase.Text": {
        ".note": {
          color: variables.listNoteColor,
          fontWeight: "200"
        },
        alignSelf: null
      },
      "NativeBase.Thumbnail": {
        alignSelf: null
      },
      "NativeBase.Image": {
        alignSelf: null
      },
      "NativeBase.Radio": {
        alignSelf: null
      },
      "NativeBase.Checkbox": {
        alignSelf: null
      },
      "NativeBase.Switch": {
        alignSelf: null
      },
      padding: null,
      flex: 0.28
    },
    "NativeBase.Text": {
      ".note": {
        color: variables.listNoteColor,
        fontWeight: "200"
      },
      alignSelf: "center"
    },
    ".last": {
      marginLeft: -(variables.listItemPadding + 5),
      paddingLeft: (variables.listItemPadding + 5) * 2,
      top: 1
    },
    ".avatar": {
      "NativeBase.Left": {
        flex: 0,
        alignSelf: "flex-start",
        paddingTop: 14
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          marginLeft: null
        },
        flex: 1,
        paddingVertical: variables.listItemPadding,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        marginLeft: variables.listItemPadding + 5
      },
      "NativeBase.Right": {
        "NativeBase.Text": {
          ".note": {
            fontSize: variables.noteFontSize - 2
          }
        },
        flex: 0,
        paddingRight: variables.listItemPadding + 5,
        alignSelf: "stretch",
        paddingVertical: variables.listItemPadding,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
      },
      ".noBorder": {
        "NativeBase.Body": {
          borderBottomWidth: null
        },
        "NativeBase.Right": {
          borderBottomWidth: null
        }
      },
      borderBottomWidth: null,
      paddingVertical: null,
      paddingRight: null
    },
    ".thumbnail": {
      "NativeBase.Left": {
        flex: 0
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          marginLeft: null
        },
        flex: 1,
        paddingVertical: variables.listItemPadding + 8,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor,
        marginLeft: variables.listItemPadding + 5
      },
      "NativeBase.Right": {
        "NativeBase.Button": {
          ".transparent": {
            "NativeBase.Text": {
              fontSize: variables.listNoteSize,
              color: variables.sTabBarActiveTextColor
            }
          },
          height: null
        },
        flex: 0,
        justifyContent: "center",
        alignSelf: "stretch",
        paddingRight: variables.listItemPadding + 5,
        paddingVertical: variables.listItemPadding + 5,
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
      },
      ".noBorder": {
        "NativeBase.Body": {
          borderBottomWidth: null
        },
        "NativeBase.Right": {
          borderBottomWidth: null
        }
      },
      borderBottomWidth: null,
      paddingVertical: null,
      paddingRight: null
    },
    ".icon": {
      ".last": {
        "NativeBase.Body": {
          borderBottomWidth: null
        },
        "NativeBase.Right": {
          borderBottomWidth: null
        },
        borderBottomWidth: variables.borderWidth,
        borderColor: variables.listBorderColor
      },
      "NativeBase.Left": {
        "NativeBase.Button": {
          "NativeBase.IconNB": {
            marginHorizontal: null,
            fontSize: variables.iconFontSize - 5
          },
          "NativeBase.Icon": {
            marginHorizontal: null,
            fontSize: variables.iconFontSize - 8
          },
          alignSelf: "center",
          height: 29,
          width: 29,
          borderRadius: 6,
          paddingVertical: null,
          paddingHorizontal: null,
          alignItems: "center",
          justifyContent: "center"
        },
        "NativeBase.Icon": {
          width: variables.iconFontSize - 5,
          fontSize: variables.iconFontSize - 2
        },
        "NativeBase.IconNB": {
          width: variables.iconFontSize - 5,
          fontSize: variables.iconFontSize - 2
        },
        paddingRight: variables.listItemPadding + 5,
        flex: 0,
        height: 44,
        justifyContent: "center",
        alignItems: "center"
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          marginLeft: null,
          fontSize: 17
        },
        flex: 1,
        height: 44,
        justifyContent: "center",
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: variables.listBorderColor
      },
      "NativeBase.Right": {
        "NativeBase.Text": {
          textAlign: "center",
          color: "#8F8E95",
          fontSize: 17
        },
        "NativeBase.IconNB": {
          color: "#C8C7CC",
          fontSize: variables.iconFontSize - 10,
          alignSelf: "center",
          paddingLeft: 10,
          paddingTop: 3
        },
        "NativeBase.Icon": {
          color: "#C8C7CC",
          fontSize: variables.iconFontSize - 10,
          alignSelf: "center",
          paddingLeft: 10,
          paddingTop: 3
        },
        "NativeBase.Switch": {
          marginRight: Platform.OS === "ios" ? undefined : -5,
          alignSelf: null
        },
        "NativeBase.PickerNB": {
          ...pickerTheme()
        },
        flexDirection: "row",
        alignItems: "center",
        flex: 0,
        alignSelf: "stretch",
        height: 44,
        justifyContent: "flex-end",
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: variables.listBorderColor,
        paddingRight: variables.listItemPadding + 5
      },
      ".noBorder": {
        "NativeBase.Body": {
          borderBottomWidth: null
        },
        "NativeBase.Right": {
          borderBottomWidth: null
        }
      },
      borderBottomWidth: null,
      paddingVertical: null,
      paddingRight: null,
      height: 44,
      justifyContent: "center"
    },
    ".myWorkSection": {
      "NativeBase.Left": {
        paddingRight: variables.listItemPadding + 5,
        flex: 0,
        height: variables.myWorkSectionItemHeight,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: variables.listBorderColor
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          marginLeft: null,
          fontSize: variables.fontSizeBase + 3,
          ".bold": {
            fontWeight: "600"
          }
        },
        flex: 1,
        height: variables.myWorkSectionItemHeight,
        justifyContent: "center",
        paddingLeft: variables.listItemPadding + 5,
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: variables.listBorderColor
      },
      "NativeBase.Right": {
        "NativeBase.Badge": {
          "NativeBase.Text": {
            fontSize: 15,
          },
          borderRadius: 2,
          backgroundColor: variables.myWorkSectionItemBadgeBg,
          paddingTop: 0,
          paddingBottom: variables.platform == 'ios' ? 0 : 1,
          paddingHorizontal: 0,
          //padding: 0,
          //textAlign: "center",
          //alignItems: "center",
          justifyContent: "center",
          height: 26,
          width: 26
        },
        flexDirection: "row",
        alignItems: "center",
        flex: 0,
        alignSelf: "stretch",
        height: variables.myWorkSectionItemHeight,
        justifyContent: "flex-end",
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: variables.listBorderColor,
        paddingRight: variables.listItemPadding + 5
      },
      borderBottomWidth: null,
      paddingVertical: null,
      paddingRight: null,
      height: variables.myWorkSectionItemHeight,
      justifyContent: "center"
    },
    ".myWorkFolderItem": {
      "NativeBase.Left": {
        "NativeBase.Text": {
          '.gd-icon': {
            alignSelf: 'flex-start',
            margin: 0
          }
        },
        flexDirection: "row",
        alignItems: "flex-start",
        flex: 0,
        paddingLeft: 15,
        paddingTop: 15+3,
        height: variables.myWorkFolderItemHeight
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          marginLeft: null,
          fontSize: variables.fontSizeBase + 2,
          '.mwfi-project': {
            fontSize: variables.fontSizeBase - 2,
            color: variables.textGrayColor,
            //position: 'absolute',
            //left: 15,
            //bottom: 15,
          }
        },
        flex: 1,
        height: variables.myWorkFolderItemHeight,
        justifyContent: "flex-start",
        //borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        //borderColor: variables.listBorderColor,
        paddingHorizontal: 15,
        paddingVertical: 15,
      },
      "NativeBase.Right": {
        flexDirection: "row",
        alignItems: "flex-start",
        flex: 0,
        alignSelf: "stretch",
        height: variables.myWorkFolderItemHeight,
        justifyContent: "flex-end",
        //borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        //borderColor: variables.listBorderColor,
        paddingRight: 15,
        paddingTop: 15,
      },
      borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
      paddingVertical: null,
      paddingRight: null,
      height: variables.myWorkFolderItemHeight,
      justifyContent: "center"
    },
    ".searchResultItem": {
      "NativeBase.Left": {
        "NativeBase.Text": {
          '.gd-icon': {
            color: variables.iconGeneralColor,
            alignSelf:'flex-start',
            //marginTop: variables.platform == 'ios' ? 1 : 3,
            // should be the same as Badge.task-type-icon-in-list
            marginLeft: 0,
            fontSize: variables.iconTaskTypeFontSize,
            lineHeight: variables.platform == 'ios' ? 19 : 21,
            height: 26,
            width: 26,
            textAlign: 'center'
          },
        },
        flexDirection: "row",
        alignItems: "flex-start",
        flex: 0,
        paddingLeft: 15,
        paddingTop: 15,
        height: variables.myWorkFolderItemHeight,
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          marginLeft: null,
          fontSize: variables.fontSizeBase + 2,
          '.sri-project': {
            fontSize: variables.fontSizeBase - 2,
            color: variables.textGrayColor,
          }
        },
        flex: 1,
        height: variables.myWorkFolderItemHeight,
        justifyContent: "flex-start",
        paddingLeft: 5,
        paddingRight: 15,
        paddingVertical: 15,
      },
      "NativeBase.Right": {
        flexDirection: "row",
        alignItems: "flex-start",
        flex: 0,
        alignSelf: "stretch",
        height: variables.myWorkFolderItemHeight,
        justifyContent: "flex-end",
        paddingRight: 15,
        paddingTop: 15,
      },
      paddingVertical: null,
      paddingRight: null,
      height: variables.myWorkFolderItemHeight,
      justifyContent: "center"
    },
    ".eventViewFieldItem": {
      "NativeBase.Body": {
        "NativeBase.Text": {
          ".note": {
            fontSize: variables.fontSizeBase - 2,
            marginBottom: 2,
          },
          margin: 0
        },
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        //borderWidth: 1,
        //borderColor: 'red',
      },
      "NativeBase.Right": {
        flex: 0,
        paddingRight: 15,
        paddingTop: 15,
      },
      paddingVertical: null,
      paddingRight: null,
    },
    ".settingsNotificationListItem": {
      "NativeBase.Body": {
        "NativeBase.Text": {
          margin: 0
        },
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
      },
      "NativeBase.Right": {
        flex: 0,
        paddingRight: 15,
        alignItems: "center"
      },
      paddingTop: 0,
      paddingBottom: Platform.OS === 'android' ? 0 : 10,
      paddingRight: null,
    },
    '.taskExtraFieldItem': {
      'NativeBase.Left': {
        'NativeBase.Text': {
          color: '#565656',
          fontSize: 12,
          fontWeight: 'bold',
        },
        width: 100,
        flex: 0,
        //borderWidth: 1,
        //borderColor: 'green'
      },
      'NativeBase.Body': {
        'NativeBase.Text': {
          color: '#030303',
          marginLeft: 0,
          fontSize: 14,
        },
        '.tefi-start-end-dates': {
          'NativeBase.Text': {
            marginRight: 5,
          },
        },
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        //paddingVertical: 10,
        //justifyContent: 'flex-end',
        //borderWidth: 1,
        //borderColor: 'blue'
      },
      'NativeBase.Right': {
        'NativeBase.Button': {
          'marginRight': -5,
        },
        flex: 0,
        paddingRight: null,
        alignItems: "flex-end",
        width: 50,
        //borderWidth: 1,
        //borderColor: 'red'

      },
      marginHorizontal: variables.listItemPadding,
      paddingHorizontal: 0,
      paddingVertical: 9,
      backgroundColor: 'transparent',
      borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    },
    '.taskExtraFieldItem-last': {
      borderBottomWidth: 0
    },
    ".gd-list-item" : {
      ".selected": {
        "NativeBase.Body": {
          "NativeBase.Text": {
            color: variables.brandDark,
            fontWeight: 'bold',
          }
        }
      },
      "NativeBase.Left": {
        paddingLeft :variables.listItemPadding,
        paddingRight: variables.listItemPadding,
        flex: 0,
        justifyContent: "center",
        alignItems: "center"
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          margin: 0
        }
      },
      height: 50,
    },
    ".noBorder": {
      borderBottomWidth: null
    },
    ".noIndent": {
      marginLeft: null,
      padding: variables.listItemPadding,
      paddingLeft: variables.listItemPadding + 6,
    },
    ".gd-list-item-task-message-group": {
      "NativeBase.Body": {
        "NativeBase.Item": {
          "NativeBase.Text": {
            marginLeft: variables.listItemPadding,
            color: variables.textGrayColor,
            fontSize: variables.fontSizeBase
          },
          borderWidth: 0,
        },
        paddingLeft: variables.listItemPadding,
      },
      "NativeBase.Right": {
        "NativeBase.Text": {
          color: variables.textGrayColor,
          fontSize: variables.fontSizeBase
        },
        flex: 0
      },
      borderBottomWidth: 0,
      paddingBottom: 0,
      //borderWidth: 1,
      //borderColor: 'red'
    },
    ".gd-list-item-task-message": {
      "NativeBase.Body": {
        "NativeBase.Text": {
          ".msg-system": {
            color: variables.textGrayColor,
            fontSize: variables.fontSizeBase - 2,
          },
          fontSize: variables.fontSizeBase,
          color: variables.textMessageColor
        },
      },
    },
    '.gd-list-item-select-project': {
      "NativeBase.Left": {
        "NativeBase.Text": {
          margin: 0,
          '.hidden': {
            color: 'transparent'
          }
        },
        paddingLeft: 0,//variables.listItemPadding,
        paddingRight: 10,//variables.listItemPadding,
        flex: 0,
        justifyContent: "center",
        alignItems: "center"
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          margin: 0
        },
        height: 40,
      },
      height: 40,
      borderWidth: 0
    },
    '.glisp-company': {
      "NativeBase.Left": {
        "NativeBase.Text": {
          fontSize: 16,
          color: '#787f82'
        },
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          fontSize: 18,
          color: '#21293c'
        },
        justifyContent: 'center'
      },
    },
    '.glisp-project': {
      "NativeBase.Left": {
        "NativeBase.Text": {
          fontSize: 16,
          color: '#787f82'
        },
        paddingRight: 10,
      },
      "NativeBase.Body": {
        flexDirection: 'row',
        "NativeBase.Text": {
          fontSize: 16,
          color: '#21293c',
          alignSelf: 'center'
        },
      },
    },
    '.activityStreamListItem': {
      "NativeBase.Left": {
        flex: 0,
        padding: 0,
        margin: 0,
      },
      "NativeBase.Body": {
        "NativeBase.Text": {
          '.asli-title': {
            marginLeft: 8,
            fontSize: 16,
            lineHeight: variables.platform == 'ios' ? 19 : 23, // same as .task-type-icon-in-list
            fontWeight: 'bold',
          },
          '.asli-task-icon': {
            fontFamily: 'gd-task-icons',
            fontSize: 16,
            lineHeight: variables.platform == 'ios' ? 19 : 23,
            margin: 0,
            color: variables.iconGeneralColor,
          },
          '.glisp-project-icon': {
            fontSize: 16,
            lineHeight: variables.platform == 'ios' ? 19 : 23,
            margin: 0,
            color: variables.iconGeneralColor,
            //alignSelf: 'flex-start',
          },
          '.gd-event-icon': {
            fontSize: 16,
            lineHeight: variables.platform == 'ios' ? 19 : 23,
            margin: 0,
            color: variables.iconGeneralColor,
          },
        },
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: variables.listItemPadding,
        paddingVertical: variables.listItemPadding,
      },
      "NativeBase.Right": {
        flex: 0,
        padding: 0,
        margin: 0,
      },
      paddingVertical: null,
      paddingRight: null,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      borderBottomWidth: 0,
      marginTop: 10,
    },
    alignItems: "center",
    flexDirection: "row",
    paddingRight: variables.listItemPadding + 6,
    paddingVertical: variables.listItemPadding + 3,
    marginLeft: 0, //variables.listItemPadding + 6,
    borderBottomWidth: variables.borderWidth,
    marginBottom: variables.borderWidth, // fix to guarantee separator visible
    backgroundColor: variables.listBg,
    borderColor: variables.listBorderColor
  };

  return listItemTheme;
};
