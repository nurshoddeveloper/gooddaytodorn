import React from 'react';
import theme from '../../app-theme/variables/platform';
import { Content, Grid, Col, Spinner } from 'native-base';

export default function loadingContent() {
  return (
    <Content contentContainerStyle={{flex: 1}} style={{padding: 10}}>
      <Grid style={{alignItems: 'center'}}>
        <Col>
          <Spinner color={theme.spinnerColor} />
        </Col>
      </Grid>
    </Content>
  )
}