import React from 'react';
import ReactStormpath, {RegistrationForm} from 'react-stormpath';


export default class RegistrationPage extends React.Component {
  constructor(){
    super()
  }
  render(){
    return <div>
      <RegistrationForm />
      </div>
  }
}