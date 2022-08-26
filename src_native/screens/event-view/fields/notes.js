import React from 'react';
import {
  Body, Right,
  Text, Input,
  ListItem
} from 'native-base';


export default class FieldNotes extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: props.event.notes
    };
    this.setMessage = this.setMessage.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
  }
  setMessage(text) {
    this.setState({message:text});
  }
  saveNotes() {
    const { message } = this.state;
    const { updateNotes } = this.props;
    const notes = String(message).replace(/^\s+|\s+$/g, '');
    updateNotes(notes);
  }
  render() {
    const { message } = this.state;
    const { event, editable } = this.props;
    return (
      <ListItem eventViewFieldItem>
        <Body>
          <Text note>Notes</Text>
          { editable ?
            <Input multiline={true}
                   numberOfLines={1}
                   style={{paddingLeft:0}}
                   value={message}
                   onChangeText={this.setMessage}
                   onEndEditing={this.saveNotes}
                   onSubmitEditing={this.saveNotes}
            />
            :
            <Text>{event.notes}</Text>
          }
        </Body>
        <Right></Right>
      </ListItem>
    );
  }
}





//export default function fieldNotes(props) {
function prevFieldNotes() {
  const { event } = props;

  return (
    <ListItem eventViewFieldItem>
      <Body>
        <Text note>Notes</Text>
        <Text>{event.notes}</Text>
      </Body>
      <Right></Right>
    </ListItem>
  );
}