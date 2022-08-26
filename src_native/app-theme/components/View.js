// @flow

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const viewTheme = {
    ".padder": {
      padding: variables.contentPadding
    },
    '.sri-status': {
      'NativeBase.Text': {
        fontSize: 12,
        fontWeight: 'bold',
      },
      paddingHorizontal: 6,
      flexDirection: 'row',
    },
    '.tci-status': {
      /*'NativeBase.Badge': {
        '.task-status-icon-tiny': {
        }
      },*/
      'NativeBase.Text': {
        fontSize: 14,
        fontWeight: 'bold',
      },
      flexDirection: 'row',
    },
    '.tci-priority': {
      /*'NativeBase.Badge': {
        '.task-priority-icon-tiny': {
        }
      },*/
      'NativeBase.Text': {
        fontSize: 14,
      },
      flexDirection: 'row',
    },
    '.tci-schedule': {
      'NativeBase.Text': {
        fontSize: 14,
      },
      flexDirection: 'row'
    },
    '.pci-selector': {
      'NativeBase.Text': {
        '.gd-icon': {
          marginLeft: 6,
          marginTop: 4,
          fontSize: 10,
          color: variables.iconGeneralColor,
        },
        fontSize: 14,
      },
      flexDirection: 'row',
    },
    '.gd-task-view-subheader': {
      'NativeBase.Text': {
        color: variables.inverseTextColor
      },
      paddingBottom: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    '.gd-task-attachments': {
      marginTop: 5,
      marginBottom: -15,
      marginLeft: variables.listItemPadding - 15,
      marginRight: 0,
      flexDirection: 'row',
      flexWrap: 'wrap',
      //borderWidth: 1,
      //borderColor: 'red'
    },
    '.gd-task-attachment': {
      'NativeBase.Button': {
        alignSelf: 'center',
        justifyContent: 'center',
        height: 84,
        width: 84,
        padding: 2,
      },
      'NativeBase.Text': {
        marginTop: 3,
        fontSize: 9,
        color: variables.textGrayColor
      },
      width: 84,
      marginLeft: 15,
      marginBottom: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.gd-task-attachment-other': {
      'NativeBase.Button': {
        'NativeBase.Text': {
          fontFamily: 'gd-icons',
          fontSize: 40,
          lineHeight: 40,
          margin: 0,
          padding: 0,
          color: variables.textGrayColor,
        },
      },
    },
    '.tefi-more-circle': {
      'NativeBase.Text': {
        fontSize: 14,
        color: variables.textGrayColor,
      },
      height: 32,
      width: 32,
      borderRadius: 16,
      padding: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f8f8',
      borderWidth: variables.borderWidth,
      color: variables.listBorderColor,
      borderColor: variables.listBorderColor,
    },
    '.task-message-texts-one-line': {
      'NativeBase.Text': {
        '.msg-system': {
          color: variables.textGrayColor,
          fontSize: variables.fontSizeBase - 2,
        },
        '.task-status-name': {
          fontSize: variables.fontSizeBase - 2,
        },
      },
      marginLeft: variables.listItemPadding,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyItems: 'center',
    },
    '.estimate-group-header': {
      'NativeBase.Text': {
        color: variables.textGrayColor,
        fontSize: variables.fontSizeBase - 2,
      },
      marginTop: variables.listItemPadding,
      marginLeft: variables.listItemPadding,
    },
    '.estimate-group-content': {
      'NativeBase.Button': {
        'NativeBase.Text': {
          padding: 0,
        },
        justifyContent: 'center',
        width: 45,
        height: 45,
        marginRight: 12,
        marginTop: 12,
      },
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      marginLeft: variables.listItemPadding,
      marginBottom: variables.listItemPadding,
    },
    '.estimate-form-block': {
      margin: 12,
      borderTopWidth: 1,
      borderTopColor: variables.listBorderColor,
    },
    '.astm-message-2lines': {
      flexDirection: 'column',
      marginTop: 10,
      marginBottom: 0,
      'NativeBase.Text': {
        '.astm-message-type': {
          fontSize: 12,
          color: variables.textGrayColor,
        },
        '.astm-message-text': {
          fontSize: 14,
          color: variables.textMessageColor,
        },
      }
    },
    '.astm-message-1line': {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 0,
      height: 20,
      'NativeBase.Text': {
        '.astm-message-type': {
          fontSize: 12,
          color: variables.textGrayColor,
          width: 120,
        },
        '.astm-message-text': {
          fontSize: 14,
          color: variables.textMessageColor,
          marginTop: -2,
        },
        '.task-status-name': {
          fontSize: 12,
          fontWeight: 'bold',
        }
      }
    }

  };

  return viewTheme;
};
