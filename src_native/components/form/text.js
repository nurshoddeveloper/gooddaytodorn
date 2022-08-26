import React, { Component } from 'react';
import { InputGroup, Input, Icon, Label } from 'native-base';
import theme from '../../app-theme/variables/platform';

export default class Text extends Component {
  render() {
    const { input, placeholder, icon, label,  meta: { error, touched }, formInputRef } = this.props;
    const showError = error !== undefined && touched;
    const add = {};
    const group = {};
    if (showError) group.error = true;
    if (formInputRef) add.ref = formInputRef;
    if (this.props.onSubmitEditing) add.onSubmitEditing = this.props.onSubmitEditing;
    if (this.props.secureTextEntry) add.secureTextEntry = true;
    if (this.props.returnKeyType) add.returnKeyType = this.props.returnKeyType;
    if (this.props.keyboardType) add.keyboardType = this.props.keyboardType;
    //console.log('showError', showError, 'touched', touched);
    //console.log('group', group);
    //console.log('add', add);
    let labelAdd = {};
    if (this.props.labelProps) labelAdd = {...this.props.labelProps};

    //input.onChangeText = input.onChange;
    //delete input.onChange;
    //console.log('input', input);
    return(
      <InputGroup {...group}>
        {icon && <Icon name={icon} style={{ color: theme.iconUserBg }} />}
        {label && <Label {...labelAdd}>{label}</Label>}
        <Input
          placeholder={placeholder}
          {...input}
          {...add}
        />
        {showError && <Icon name="warning" />}
      </InputGroup>
    )
  }
  componentDidMount() {
    const { focusOnMount, formInputRef } = this.props;
    if (focusOnMount && formInputRef) {
      this.refs[formInputRef]._root.focus();
    }
  }
}
