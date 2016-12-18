import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';

export default class LogIn extends Component {
  constructor() {
    super();
    this.state={
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
    HTTP.post('/login', data);
  }


  render(){
  	return(
  	<div>
      <li className='menu-link'> <Link className='link' to="/dashboard">Back</Link> </li>
  		<form>
          <label> Email Address: </label>
          <input type="text" name="email"  value={this.state.email} 
                             onChange={this.handleChange.bind(this, 'email')}>
          </input><br/>
          <label> Password: </label>
          <input type="password" name="password"  value={this.state.password} 
                             onChange={this.handleChange.bind(this, 'password')}>
          </input><br/>
          <input type="submit" value="Log In" ></input>
      </form>
  	</div>
  	)
  }
}