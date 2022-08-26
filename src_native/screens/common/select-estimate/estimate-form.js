import React, { PureComponent } from 'react';
import { Form, Button, Text, Spinner } from 'native-base';
import { Field, reduxForm } from 'redux-form';
import TextField from '../../../../src_native/components/form/text';
import theme from '../../../app-theme/variables/platform';
import { isNumeric } from '../../../common/utils';


const validate = values => {
  const errors = { hours: '', minutes: ''};

  let hours = values.hours;
  if (hours === undefined || hours === null){
    hours = '';
  }

  let minutes = values.minutes;
  if (minutes === undefined || minutes === null){
    minutes = '';
  }

  if (hours.length < 1 && minutes.length < 1) {
    errors.hours = 'Please enter correct hours';
    errors.minutes = 'Please enter correct minutes';
  } else {
    if (!isNumeric(hours)) {
      errors.hours = 'Please enter correct hours';
    }

    if (!isNumeric(minutes)) {
      errors.minutes = 'Please enter correct minutes';
    }

    if (isNumeric(hours) && minutes.length == 0) {
      delete errors.minutes;
    }
    if (isNumeric(minutes) && hours.length == 0) {
      delete errors.hours;
    }
  }
  //console.log('validate errors', errors)
  return errors;
};

class EstimateForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { handleSubmit, submitting, error } = this.props;

    return (
      <Form style={{alignItems:'center'}}>
        {error && <Text style={{color:theme.brandDanger}}>{error}</Text>}
        <Field name="hours"
               label="Hours"
               labelProps={{'estimate-label':true}}
               component={TextField}
               keyboardType="number-pad"
               onSubmitEditing={handleSubmit}
        />
        <Field name="minutes"
               label="Minutes"
               labelProps={{'estimate-label':true}}
               component={TextField}
               keyboardType="number-pad"
               onSubmitEditing={handleSubmit}
        />
        <Button style={{marginTop: 30}} block onPress={handleSubmit} disabled={submitting}>
          {submitting && <Spinner color={theme.spinnerColor} /> }
          <Text>Save</Text>
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'estimate',
  validate
})(EstimateForm);
