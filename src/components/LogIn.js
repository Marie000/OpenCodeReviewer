import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import cookie from 'react-cookie';
import { LoginForm, ResetPasswordForm } from 'react-stormpath';

export default class LogIn extends Component {
  
render(){
  return <div>
    <LoginForm />
    </div>
  }
}