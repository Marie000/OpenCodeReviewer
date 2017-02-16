import React,{ Component } from 'react';
import { ChangePasswordForm } from 'react-stormpath'

export default class ChangePassword extends Component {
  constructor(){
    super()
  }
  render() {
    return <ChangePasswordForm spToken={this.props.location.query.sptoken}/>
  }
}