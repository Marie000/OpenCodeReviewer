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

  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  handleChange (input, e) {
    var change = {};
    change[input] = e.target.value;
    this.setState(change);
  }

  handleSubmit(e) {
    e.preventDefault();
    var data = this.state;
    console.log(data)
    HTTP.post('/users', data);

     window.setTimeout(function () {  
      this.context.router.push('/login');
    }.bind(this), 500);
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
          <button type="submit" onClick={this.handleSubmit.bind(this)} value="Sign In" >Sign In</button>
      </form>
  	</div>
  	)
  }
}