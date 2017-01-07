import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import cookie from 'react-cookie';

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
    var scope = this;
    console.log(data)


      var request = new XMLHttpRequest();
      request.open('POST', 'http://localhost:8080/api/login', true);
      request.setRequestHeader('Content-Type', 'application/JSON');
      request.withCredentials = true;
      request.onload = function () {
        var res = this.responseText;
        console.log(res)
  //      var res = JSON.parse(this.responseText);
        var token = res.cookie;
        console.log("token: ", token);
   //     cookie.save('token', token, {httpOnly: true} )
 //       scope.setState({token: res.token})
        console.log('load:',cookie.load('token'))
      };

      request.send(JSON.stringify(data));

      return false
 //   var response = HTTP.post('/login', data);

  }


  render(){
  	return(
  	<div>
      <li className='menu-link'> <Link className='link' to="/dashboard">Back</Link> </li>
  		<form >
          <label> Email Address: </label>
          <input type="text" name="email"  value={this.state.email} 
                             onChange={this.handleChange.bind(this, 'email')}>
          </input><br/>
          <label> Password: </label>
          <input type="password" name="password"  value={this.state.password} 
                             onChange={this.handleChange.bind(this, 'password')}>
          </input><br/>
          <button type="button" value="Log In" onClick={this.handleSubmit.bind(this)} >Log In</button>
      </form>
  	</div>
  	)
  }
}