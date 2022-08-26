import React from 'react';
import { Linking } from 'react-native';
import { Thumbnail, Button, Text, View } from 'native-base';
import { getGlyphByName } from '../../../common/icons';
import theme from '../../../app-theme/variables/platform';

export default class TaskAttachmentPreview extends React.PureComponent {

  renderDefault() {
    const { attachment, navigation } = this.props;
    const { AVAILABLE, UNKNOWN, NOT_AVAILABLE } = gd.const.attachment.preview;
    const { LOCAL, AMAZON } = gd.const.storageProvider;
    let result;

    switch (attachment.preview) {
      case AVAILABLE:
        let previewUri, fullUri;
        // there is attachment
        if (attachment.storageProvider == AMAZON) {
          previewUri = gdConfig.amazonImagePrefix + attachment.companyId + '/' + attachment.fileId + '/160px.jpg';
          fullUri = gdConfig.amazonImagePrefix + attachment.companyId + '/' + attachment.fileId + '/1200px.jpg';
        } else {
          previewUri = gdConfig.apiUrl + 'attachment/preview/' + attachment.fileId + '/160';
          fullUri = gdConfig.apiUrl + 'attachment/open/' + attachment.fileId;
        }


        result = (
          <View gd-task-attachment>
            <Button light onPress={() => navigation.navigate('view_image', {uri:fullUri, name:attachment.name})}>
              <Thumbnail square large source={{uri: previewUri }} resizeMode="contain" />
            </Button>
            <Text numberOfLines={1}>{attachment.name}</Text>
          </View>
        );
        break;

      case UNKNOWN:
      case NOT_AVAILABLE:
      default:
        // preview is being generated or no preview available at all
        let icon = 'file';
        switch (attachment.fileType) {
          case 1: icon = 'file-image'; break;
          case 2: icon = 'file-text'; break;
          //case 3: icon = ''; break;
          case 4: icon = 'file-archive-o'; break;
          case 5: icon = 'file-code-o'; break;
          case 6: icon = 'file-video-o'; break;
          case 7: icon = 'file-audio'; break;
          //case 8: icon = ''; break;
          case 9: icon = 'file-image'; break;
          //case 10: icon = ''; break;
          //case 11: icon = ''; break;
        }
        //console.log('icon', icon);
        const glyph = String.fromCharCode(getGlyphByName(icon));
        const fileUri = gdConfig.apiUrl + 'attachment/open/' + attachment.fileId;

        result = (
          <View gd-task-attachment gd-task-attachment-other>
            <Button light onPress={() => Linking.openURL(fileUri)} style={{padding:0}}>
              <Text style={{color: theme.textGrayColor}}>{glyph}</Text>
            </Button>
            <Text numberOfLines={1}>{attachment.name}</Text>
          </View>
        );

        break;
    }

    return result;
  }

  renderGoogleDrive() {
    const { attachment } = this.props;
    const { fileId, fileType, mime } = attachment;
    const previewUri = 'https://drive.google.com/thumbnail?authuser=0&sz=w220&id=' + fileId;

    let onPress = () => {};
    const isGoogleDoc = (fileType == gd.const.attachment.fileType.GOOGLE_DOCUMENT);
    if (isGoogleDoc) {
      let viewUrl = null;
      switch(mime) {
        case 'application/vnd.google-apps.document':        viewUrl = "https://docs.google.com/document/d/"+fileId+"/edit"; break;
        case 'application/vnd.google-apps.spreadsheet':     viewUrl = "https://docs.google.com/spreadsheets/d/"+fileId+"/edit"; break;
        case 'application/vnd.google-apps.drawing':         viewUrl = "https://docs.google.com/drawings/d/"+fileId+"/edit"; break;
        case 'application/vnd.google-apps.form':            viewUrl = "https://docs.google.com/forms/d/"+fileId+"/edit"; break;
        case 'application/vnd.google-apps.presentation':    viewUrl = "https://docs.google.com/presentation/d/"+fileId+"/edit"; break;
        default:                                            viewUrl = "https://drive.google.com/file/d/"+fileId+"/view?usp=drivesdk";
      }
      onPress = () => Linking.openURL(viewUrl);
    } else {
      onPress = () => Linking.openURL("https://drive.google.com/file/d/"+fileId+"/view?usp=drivesdk");
    }

    return (
      <View gd-task-attachment>
        <Button light onPress={onPress}>
          <Thumbnail square large source={{uri: previewUri }} resizeMode="contain" />
        </Button>
        <Text numberOfLines={1}>{attachment.name}</Text>
      </View>
    );
  }

  render() {
    const { LOCAL, AMAZON, GOOGLE_DRIVE } = gd.const.storageProvider;
    let result;
    switch (this.props.attachment.storageProvider) {
      case GOOGLE_DRIVE:
        result = this.renderGoogleDrive();
        break;
      case LOCAL:
      case AMAZON:
      default:
        result = this.renderDefault();
    }
    return result;
  }
}