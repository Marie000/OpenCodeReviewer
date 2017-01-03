import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';

export default class SignIn extends Component {
  constructor() {
    super();
    this.state={
      user_name: "",
      password: "",
      email :""
    }

  }


  handleChange (input, e) {
    var change = {};
    change[input] = e.target.value;
    this.setState(change);
  }


  handleSubmit(e) {
    e.preventDefault();
    var data = this.state;
    HTTP.post('/users', data);
  }

  render(){
  	return(
  	<div>
      <li className='menu-link'> <Link className='link' to="/dashboard">Back</Link> </li>
  		<p> Sign in here </p>

      <form>
      <label> User Name: </label>
          <input type="text" name="user_name"  value={this.state.user_name} 
                             onChange={this.handleChange.bind(this, 'user_name')}>
          </input><br/>
          <label> Email Address: </label>
          <input type="text" name="email"  value={this.state.email} 
                             onChange={this.handleChange.bind(this, 'email')}>
          </input><br/>
          <label> Password: </label>
          <input type="password" name="password"  value={this.state.password} 
                             onChange={this.handleChange.bind(this, 'password')}>
          </input><br/>
          <input type="submit" value="Sign In" ></input>
      </form>
  	</div>
  	)
  }
}