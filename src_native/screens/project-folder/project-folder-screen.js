import React from 'react'
import { StyleProvider, Container, Left, Button, Icon, Body } from 'native-base'
import { Title, Right, Content } from 'native-base'
import { connect } from 'react-redux'

import ColorHeader from '../../components/color-header'
import ProjectsRoot from '../project-tasks/projects-root'

import getTheme from '../../app-theme/components'
import theme from '../../app-theme/variables/platform'


import { moveTaskToFolder } from '../../redux/actions/task'

function ProjectFolderScreen({ navigation, moveTaskToFolder }) {
  const task = navigation.getParam('task')
  const handleMove = (projectId, companyId) => {
    moveTaskToFolder(task, projectId, companyId)
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
            <Title>Move to folder</Title>
          </Body>
          <Right />
        </ColorHeader>
        <Content content-projects-tree>
          <ProjectsRoot
            projectId={task?.projectId}
            hideCompany
            dontMarkSelectedProject
            onPress={handleMove}
          />
        </Content>
      </Container>
    </StyleProvider>
  )
}

const mapDispatchToProps = {
  moveTaskToFolder
}

export default connect(null, mapDispatchToProps)(ProjectFolderScreen)
