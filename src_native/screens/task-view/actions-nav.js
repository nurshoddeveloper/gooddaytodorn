import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import { createNoArUser, getSafeTaskStatus } from '../../common/utils'
import { getColorById } from '../../common/status-colors'

export default function ActionsNav({ task, actions, onLayout }) {
  if (!task.isOpen) return null
  const arUser =
    gd.session.users.get(task.actionRequiredUserId) || createNoArUser()
  const taskStatus = getSafeTaskStatus(task.taskTypeId, task.statusId)
  const color = getColorById(taskStatus.color)
  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.col}>
        <TouchableOpacity
          style={styles.row}
          onPress={actions.openSelectUserScreen}
        >
          <Text style={styles.subtitle}>Action required: </Text>
          <Text style={styles.userName} numberOfLines={2}>{arUser.name}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticalLine} />
      <TouchableOpacity
        style={styles.btn}
        onPress={
          task.isOpen ? actions.openSelectStatusScreen : actions.openReplyScreen
        }
      >
        <Text style={[styles.btnTitle, { color }]}>{taskStatus.name}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 47,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EBED',
    top: -1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  col: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    paddingLeft: 16,
    color: '#565656',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16
  },
  userName: {
    flex: 1,
    color: '#030303',
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    lineHeight: 18
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#E9EBED'
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnTitle: {
    fontSize: 13,
    fontFamily: 'OpenSans-Bold',
    textTransform: 'uppercase'
  }
})
