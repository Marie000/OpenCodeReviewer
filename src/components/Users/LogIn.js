import React from 'react';
import { LoginForm } from 'react-stormpath';
import { Link } from 'react-router';

export default function LogIn () {
  return <div>
      <LoginForm />
    <p className="registerLink">New User? <Link to="/register">Register Here</Link></p>
    </div>
}