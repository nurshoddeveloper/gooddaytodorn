import React from 'react';
import { Text } from 'native-base';
import { StyleSheet, View } from 'react-native'
import { Icon } from 'native-base'
import { getGlyphByName } from '../common/icons';

export default function AttachmentItem({ title, onPressDelete }) {
  const glyphCheck = String.fromCharCode(getGlyphByName('ok'));
  const glyphDelete = String.fromCharCode(getGlyphByName('delete'));
  return (
    <View style={styles.container}>
      <Text gd-icon style={styles.checkIcon}>{glyphCheck}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text gd-icon style={styles.deleteIcon} onPress={onPressDelete}>
        {glyphDelete}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 2
  },
  checkIcon: {
    color: '#3CB24F',
    fontSize: 13
  },
  title: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#1F2836',
    fontSize: 13,
    fontFamily: 'OpenSans-Bold'
  },
  deleteIcon: {
    color: '#4F4F4F',
    fontSize: 13
  }
})
