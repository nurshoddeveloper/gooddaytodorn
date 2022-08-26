import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import theme from '../../app-theme/variables/platform';
import { Spinner } from 'native-base';

export default function loadingAfterInteractions() {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color={theme.spinnerColor} />
      {false && <Spinner color={theme.spinnerColor} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});