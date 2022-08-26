import React from 'react';
import {
  Body, Right,
  Button, Icon, Text,
  ListItem, View
} from 'native-base';

export default function fieldDate(props) {
  const { event, editable, openSelectDateStartScreen, openSelectDateEndScreen } = props;

  let start, delimeter, end;
  start = event.startDate ? event.startDate.format('MMM D, YYYY') : 'Start date';
  if (event.endDate) {
    delimeter = ' - ';
    end = event.endDate.format('MMM D, YYYY');
  } else if (event.type === gd.const.event.type.PROJECT_EVENT) {
    delimeter = '  -  ';
    end = event.endDate ? event.endDate.format('MMM D, YYYY') : 'End date';
  }

  let a1 = {}, a2 = {};
  if (editable)  {
    a1 = {
      style: {textDecorationLine: 'underline'},
      onPress: openSelectDateStartScreen
    };
    a2 = {
      style: {textDecorationLine: 'underline'},
      onPress: openSelectDateEndScreen
    };
  }

  if (end) {

    return (
      <ListItem eventViewFieldItem>
        <Body>
          <Text note>Date</Text>
          <View style={{flexDirection: 'row'}}>
            <Text {...a1}>{start}</Text>
            {delimeter && <Text>{delimeter}</Text>}
            {end && <Text {...a2}>{end}</Text>}
          </View>
        </Body>
        <Right />
      </ListItem>
    )

  } else {

    delete a1.style;

    if (editable) {
      return (
        <ListItem eventViewFieldItem button={true} onPress={openSelectDateStartScreen}>
          <Body>
            <Text note>Date</Text>
            <View style={{flexDirection: 'row'}}>
              <Text {...a1}>{start}</Text>
            </View>
          </Body>
          <Right style={{paddingTop:20}}>
            <Button gd-button-round-more onPress={openSelectDateStartScreen}>
              <Icon name="ios-more" />
            </Button>
          </Right>
        </ListItem>
      )

    } else {
      return (
        <ListItem eventViewFieldItem>
          <Body>
            <Text note>Date</Text>
            <View style={{flexDirection: 'row'}}>
              <Text {...a1}>{start}</Text>
            </View>
          </Body>
          <Right />
        </ListItem>
      )
    }
  }

  // prev
  return (
    <ListItem eventViewFieldItem>
      <Body>
        <Text note>Date</Text>
        <View style={{flexDirection: 'row'}}>
          <Text {...a1}>{start}</Text>
          {delimeter && <Text>{delimeter}</Text>}
          {end && <Text {...a2}>{end}</Text>}
        </View>
      </Body>
      <Right />
    </ListItem>
  );
}
