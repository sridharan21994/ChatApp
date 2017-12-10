import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const Profile = ({
  onSubmit,
  onChange,
  errors,
  user,
  userDetail
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Edit Profile</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          hintText="change user name"
          defaultValue={userDetail.name}
          floatingLabelFixed={true}
          floatingLabelText="Change User Name"
          name="name"
          errorText={errors.name}
          onChange={onChange}
        />
      </div>

      <div className="field-line">
        <TextField
          hintText="new password"
          floatingLabelFixed={true}
          floatingLabelText="New Password"
          type="password"
          name="newpassword"
          onChange={onChange}
          errorText={errors.password}
          value={user.newpassword}
        />
      </div>

      <div className="field-line">
        <TextField
          hintText="confirm new password"
          floatingLabelFixed={true}
          floatingLabelText="Confirm New Password"
          type="password"
          name="confirmnewpassword"
          onChange={onChange}
          errorText={errors.password}
          value={user.confirmnewpassword}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Save" primary />
      </div>
       <div className="button-line">
        <RaisedButton href="/" label="Cancel & go to dashboard" secondary />
      </div>
    </form>
  </Card>
);

Profile.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
//   userDetail: PropTypes.object.isRequired
};

export default Profile;

