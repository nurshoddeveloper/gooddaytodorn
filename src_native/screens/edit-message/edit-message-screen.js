import React, { useState } from 'react'
import { StyleProvider, Container, Left, Button, Icon, Body } from 'native-base'
import { Title, Right, Content, Input, Text, ListItem, View } from 'native-base'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import ColorHeader from '../../components/color-header'

import getTheme from '../../app-theme/components'
import theme from '../../app-theme/variables/platform'

export default function EditMessageScreen({ navigation }) {
  const task = navigation.getParam('task')
  const message = navigation.getParam('message')
  const onChangeText = navigation.getParam('onChangeText')
  const [text, setText] = useState(message?.message || '')
  const handleSave = () => {
    if (typeof onChangeText === 'function') {
      onChangeText(text, message)
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
            <Title>{task?.title}</Title>
          </Body>
          <Right />
        </ColorHeader>
        <Content content-projects-tree>
          <ListItem>
            <View style={styles.col}>
              <Text style={styles.title}>Message:</Text>
              <Input
                value={text}
                placeholder="Please enter message..."
                multiline={true}
                numberOfLines={10}
                style={styles.input}
                maxHeight={200}
                onChangeText={setText}
              />
            </View>
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
  title: {
    color: '#565656',
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    marginLeft: 15
  },
  input: {
    color: '#030303',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    marginHorizontal: 11
  },
  btn: {
    margin: 16
  }
})
