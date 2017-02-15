import React from 'react';
import ReactStormpath, {RegistrationForm} from 'react-stormpath';
import HTTP from '../services/httpservice';


export default class RegistrationPage extends React.Component {
  onFormSubmit(e,next) {
    e.preventDefault();
    var data = {
      first_name:e.data.givenName,
      last_name:e.data.surname,
      user_name:e.data.username
    };
    HTTP.post('/users', data);

    window.setTimeout(function () {
      this.context.router.push('/login');
    }.bind(this), 500);

    next();
  }
  render(){
    return <div>
      <RegistrationForm onSubmit={this.onFormSubmit.bind(this)} />
      </div>
  }
}