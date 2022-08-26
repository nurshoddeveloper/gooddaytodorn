import React, { useState } from 'react'
import { StyleProvider, Container, Left, Button, Icon, Body } from 'native-base'
import { Title, Right, Content, Input, Text, ListItem } from 'native-base'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import ColorHeader from '../../components/color-header'

import getTheme from '../../app-theme/components'
import theme from '../../app-theme/variables/platform'

export default function TaskRenameScreen({ navigation }) {
  const task = navigation.getParam('task')
  const onChangeText = navigation.getParam('onChangeText')
  const [text, setText] = useState(task?.title || '')
  const handleSave = () => {
    if (typeof onChangeText === 'function') {
      onChangeText(text)
    }
    navigation.goBack()
  }
  return (
    <StyleProvider style={getTheme(theme)}>
      <Container>
        <ColorHeader style={{backgroundColor: theme.toolbarDefaultBg}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Rename task</Title>
          </Body>
          <Right />
        </ColorHeader>
        <Content content-projects-tree>
          <ListItem>
            <Input
              value={text}
              placeholder="Task name"
              style={styles.input}
              // maxHeight={104}
              onChangeText={setText}
            />
          </ListItem>
          <Button style={styles.btn} block onPress={handleSave}>
            <Text>Save</Text>
          </Button>
        </Content>
      </Container>
    </StyleProvider>
  )
}

const styles = StyleSheet.create({
  input: {
    color: '#030303',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    marginHorizontal: 16
  },
  btn: {
    margin: 16
  }
})
