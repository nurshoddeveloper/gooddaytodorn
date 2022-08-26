import React, { Component } from 'react';
import { Form, Button, Text, Spinner } from 'native-base';
import { Field, reduxForm } from 'redux-form';
import TextField from '../../../src_native/components/form/text';
import theme from '../../app-theme/variables/platform';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const validate = values => {
  const errors = {email: '', password: ''};

  let email = values.email;
  if (email === undefined || email === null){
    email = '';
  }

  if (email.length < 1) {
    errors.email = 'Please enter email';
  }

  if (!validateEmail(email)) {
    errors.email = 'Please check email';
  }

  let password = values.password;
  if (password === undefined || password === null){
    password = '';
  }

  if (password.length < 1) {
    errors.password = 'Please enter password';
  }

  return errors;
};

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleEmailFinish = this.handleEmailFinish.bind(this);
  }
  componentDidMount() {
    const { email } = this.props.initialValues;
    if (validateEmail(email)) {
      this.refs.fieldPassword.getRenderedComponent().refs.fiPassword._root.focus();
    } else {
      this.refs.fieldEmail.getRenderedComponent().refs.fiEmail._root.focus();
    }
  }
  handleEmailFinish() {
    setTimeout(() => {
      try {
        this.refs.fieldPassword.getRenderedComponent().refs.fiPassword._root.focus();
      } catch(e) {}
    }, 500);
  }
  render() {
    const { handleSubmit, submitting, error, initialValues } = this.props;
    const _error = error || initialValues?.error
    return (
      <Form style={{alignItems:'center'}}>
        {_error && <Text style={{color:theme.brandDanger}}>{_error}</Text>}
        <Field name="email"
               placeholder="Email"
               icon="ios-person"
               component={TextField}
               onSubmitEditing={this.handleEmailFinish}
               withRef ref="fieldEmail" formInputRef="fiEmail"
               returnKeyType="next"
        />
        <Field name="password"
               placeholder="Password"
               icon="ios-unlock"
               component={TextField}
               onSubmitEditing={handleSubmit}
               secureTextEntry={true}
               withRef ref="fieldPassword" formInputRef="fiPassword"
        />
        <Button style={{marginTop: 30}} block onPress={handleSubmit} disabled={submitting}>
          {submitting && <Spinner color={theme.spinnerColor} /> }
          <Text>Login</Text>
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'login',
  validate
})(LoginForm);
