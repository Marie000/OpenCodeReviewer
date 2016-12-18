import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';


class App extends Component {

  constructor() {
    super();
    
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

  render() {

    return (
      <div className="App">
        <div className="App-header">

          <h2> <Link className='link' to="/dashboard">Check My Code</Link></h2>
          <h4>Open Code Review Platform</h4>
        </div>
        <div>
       
    
        <ul className='menu'>
          <li className='menu-link'><Link className='link' to="/signin" >Sign In</Link></li>
          <li className='menu-link'><Link className='link' to="/login" >Log In</Link></li>  
          <li className='menu-link'><Link className='link' to="/profile" >Profile</Link></li> 
       </ul>
       
       

         <div className = 'child'>
        {this.props.children}
        </div>
        <p></p>      

      
        </div>
         <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>

    );
  }
}

export default App;
