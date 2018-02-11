import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <Card className={isDesktop?"container":"container-sm"}>
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign Up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          hintText="Name"
          floatingLabelFixed={true}
          floatingLabelText="Name"
          name="name"
          errorText={errors.name}
          onChange={onChange}
          value={user.name}
          fullWidth={isDesktop?false:true}
        />
      </div>

      <div className="field-line">
        <TextField
          hintText="Email"
          floatingLabelFixed={true}
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
          fullWidth={isDesktop?false:true}
        />
      </div>

      <div className="field-line">
        <TextField
          hintText="Password"
          floatingLabelFixed={true}
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
          fullWidth={isDesktop?false:true}
        />
      </div>

      <div className="button-line">
        <RaisedButton 
        fullWidth={isDesktop?false:true}
        type="submit" 
        label="Create New Account" 
        primary 
        />
      </div>

      <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
    </form>
  </Card>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;

