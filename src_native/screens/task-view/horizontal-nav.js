import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import _ from 'lodash'
import LinearGradient from 'react-native-linear-gradient'

export default function HorizontalNav({ titles, activeTab, setTab }) {
  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.empty} />
          {_.map(titles, (title, key) => {
            const isActive = activeTab === key
            return (
              <View key={key} style={styles.row}>
                <TouchableOpacity
                  style={[styles.btn, isActive && styles.activeBtn]}
                  onPress={() => setTab(key)}
                >
                  <Text style={[styles.title, isActive && styles.activeTitle]}>
                    {title}
                  </Text>
                </TouchableOpacity>
                <View style={styles.empty} />
              </View>
            )
          })}
        </ScrollView>
      </View>
      <View style={styles.lastItemOpacity}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </View>
      <View style={styles.bottomLine} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    height: 33,
    width: '100%'
  },
  scroll: {
    position: 'absolute',
    zIndex: 3,
    width: '100%'
  },
  row: {
    flexDirection: 'row'
  },
  empty: {
    width: 16
  },
  btn: {
    height: 32,
    paddingHorizontal: 4
  },
  activeBtn: {
    height: 33,
    borderBottomWidth: 2,
    borderBottomColor: '#4D94F1'
  },
  title: {
    color: '#333333',
    fontSize: 13,
    fontFamily: 'OpenSans-Bold',
    textTransform: 'uppercase'
  },
  activeTitle: {
    color: '#4D94F1'
  },
  lastItemOpacity: {
    position: 'absolute',
    zIndex: 1,
    width: 20,
    height: 31,
    right: 0
  },
  gradient: {
    flex: 1
  },
  bottomLine: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: 1,
    backgroundColor: '#E9EBED',
    bottom: 1
  }
})
