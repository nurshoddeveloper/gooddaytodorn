import React, { PureComponent } from 'react';
import { Form, Button, Text, Spinner } from 'native-base';
import { Field, reduxForm } from 'redux-form';
import TextField from '../../../../src_native/components/form/text';
import theme from '../../../app-theme/variables/platform';
import { isNumeric } from '../../../common/utils';


const validate = values => {
  const errors = { percent: ''};

  let percent = values.percent;
  if (percent === undefined || percent === null){
    percent = '';
  }

  if (percent.length < 1) {
    errors.percent = 'Please enter percent';
  } else if (!isNumeric(percent)) {
    errors.percent = 'Please enter correct percent';
  } else if (percent < 0 || percent > 100) {
    errors.percent = 'Please enter correct percent';
  }

  //console.log('validate errors', errors)
  return errors;
};

class ProgressForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { handleSubmit, submitting, error } = this.props;

    return (
      <Form style={{alignItems:'center'}}>
        {error && <Text style={{color:theme.brandDanger}}>{error}</Text>}
        <Field name="percent"
               label="Percent"
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
  form: 'progress',
  validate
})(ProgressForm);
