import React, { Component } from 'react';
import HTTP from '../services/httpservice';
import { Link } from 'react-router';
import './App.css';
import { Router, Route } from 'react-router';


//this is only there to test the Github thing:
import Github from './Github.js';


class App extends Component {

   static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = { 
      loggedIn:false
    }
  }
/*
   handleSubmit(){
    var request = new XMLHttpRequest();
    console.log('click')
    request.open('POST', 'http://localhost:6060/animals', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('data=dana');
   } 
*/

  logOutUser(){
    var data = {'user._id':localStorage.user_id}
    HTTP.delete('/logout', data);
    localStorage.clear();

    window.setTimeout(function () {  
      this.context.router.push('/login');
    }.bind(this), 1000); 
  }

  render() {
    var user_name = null
    if (localStorage.first_name && localStorage.first_name !==  'undefined'){
      user_name = <p> Keep up the good code, {localStorage.first_name}! </p>
    } else if (localStorage.user_name){
      user_name = <p> Keep up the good code, {localStorage.user_name}! </p>
    }

    var buttons;
      if (!localStorage.user_name){
        buttons = <ul className='menu'><a className='link' to="/signin" ><li className='inline-blk button-darkgreen'>About</li></a>
        <Link className='link' to="/signin" ><li className=' mrgLeft10 inline-blk  button-darkgreen'>Sign In</li></Link>
        <Link className='link' to="/login" ><li className='mrgLeft10 inline-blk  button-darkgreen'>Log In</li></Link>
        </ul>
      } else {
        buttons = <ul className='menu'><a className='link' to="/signin" ><li className='inline-blk button-darkgreen'>About</li></a>
        <Link className='link' to={'/profile/'+localStorage.user_id}><li className='button-darkgreen inline-blk mrgLeft10'>Profile</li></Link>
        <Link className='link' to="/dashboard" ><li className='mrgLeft10 button-darkgreen inline-blk' onClick={this.logOutUser.bind(this)}>Log Out</li></Link></ul>
      }

      return (
      <div className="App">
        <div className="App-header">
          <div className="header-text">
            <h2> <Link className='link' to="/dashboard">Ch3ck My C0de</Link></h2>
            <h4>Open Code Review Platform</h4> {this.state.loggedIn}
          </div>
          <div className="buttons"> {buttons} </div>
          <div className="greeting">{user_name}</div>
        </div>
        <div>

        <div className = 'child'>
          {this.props.children}
        </div>
        <p></p>      

      
        </div>
         <p className="App-intro">
         <br/><br/> <br/><br/>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <Github />
      </div>

    );
  }
}

export default App;
