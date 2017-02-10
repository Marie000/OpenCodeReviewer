import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import cookie from 'react-cookie';

export default class LogIn extends Component {
  
  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state={
      password: "",
      email :"",
      error: ""
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

    var request = new XMLHttpRequest();
    request.open('POST', '/api/login', true);
    request.setRequestHeader('Content-Type', 'application/JSON');
    request.withCredentials = true;
    request.onload = function () {
      var res = this.responseText;
      var status = this.status;
      if (status === 200){
        try {
          var user = JSON.parse(res);
          localStorage.setItem('user_id', user._id);
          localStorage.setItem('user_name', user.user_name);
          localStorage.setItem('first_name', user.first_name);

          window.setTimeout(function () {  
            scope.context.router.push('/dashboard');
          }.bind(this), 500);

        } catch(e) {
          console.log("catch: ",e)
        }
      } else {
        console.log("error: ",res);
        scope.setState({error:res})
      }
    }; 

    request.send(JSON.stringify(data));
    return false  
  }

  render(){
  	return(
  	<div>
      <li className='menu-link'> <Link className='link' to="/dashboard">Back</Link> </li>
      <div className='profile-container'>
      <h1> Log In </h1>
  		<form >
          <label> Email Address: </label>
          <input type="text" name="email"  value={this.state.email} 
                             onChange={this.handleChange.bind(this, 'email')}>
          </input><br/>
          <label> Password: </label>
          <input type="password" name="password"  value={this.state.password} 
                             onChange={this.handleChange.bind(this, 'password')}>
          </input><br/>
          <button type="button"  className='button-darkgreen' value="Log In" onClick={this.handleSubmit.bind(this)} >Log In</button>

          <div>{this.state.error}</div>

      </form>
      </div>
  	</div>
  	)
  }
}