import React from 'react';
import { Thumbnail, Badge, Text } from 'native-base';
import { getColorByClass } from '../../common/alphabet-colors';
import { AR_NO_ACTION_REQUIRED } from '../../common/constants';
import { getGlyphByName } from '../../common/icons';

export default function userIcon(props) {
  const { user, style } = props;
  const add = {};
  if (style) add.style = {...style};

  if (!user || !user.name) {
    // render mom
    const momSrc = gdConfig.assetsPath + 'skin/common/img/gd-user/160.png';
    return <Thumbnail small source={{uri: momSrc}} {...add} />;
  }

  if (user.id && user.id == AR_NO_ACTION_REQUIRED) {
    const glyph = String.fromCharCode(getGlyphByName('user'));
    //return <Text gd-icon>{glyph}</Text>;
    return <Badge user-icon {...add}><Text gd-icon>{glyph}</Text></Badge>;
  }
  if (!user.icon || user.icon == '_def.jpeg') {
    const userInitials = gd.utils.initials(user.name, 2);
    let colorLetter = userInitials.substr(0, 1).toLowerCase();
    if (colorLetter.match(/[^a-z0-9]/)) {
      colorLetter = 'a';
    }
    add.style = add.style || {};
    add.style.backgroundColor = getColorByClass('gd-' + colorLetter);

    return <Badge user-icon {...add}><Text numberOfLines={1}>{userInitials}</Text></Badge>;

  } else {

    const uiSrc = gdConfig.mediaPath + 'user/large/' + user.icon;
    return <Thumbnail small source={{uri: uiSrc}} {...add} />;
  }

}