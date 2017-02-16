import React from 'react';
import ReactStormpath, {RegistrationForm} from 'react-stormpath';
import axios from 'axios';


export default class RegistrationPage extends React.Component {
  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }
  onFormSubmit(e,next) {
    e.preventDefault();
    var data = {
      first_name:e.data.givenName,
      last_name:e.data.surname,
      user_name:e.data.username
    };
    axios.post('/api/users',data)
      .then(()=>{
        this.context.router.push('/login');
      })

    next();
  }
  render(){
    return <div>
      <RegistrationForm onSubmit={this.onFormSubmit.bind(this)} />
      </div>
  }
}