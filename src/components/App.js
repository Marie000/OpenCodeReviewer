import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';
import { Authenticated, NotAuthenticated } from 'react-stormpath';
import {Navbar, NavItem} from 'react-materialize';


class App extends Component {

   static contextTypes= {
    router: React.PropTypes.object.isRequired,
     user: React.PropTypes.object
  }

  render() {

    let brand = <div className="brand"> <Link to="/dashboard"><h2>Ch3ck My C0de</h2>
      <h3>Open Code Review Platform</h3></Link>
    </div>

      return <div className="App">
        {/*<div className="App-header">
          <div className="header-text">
            <h2> <Link className='link' to="/dashboard">Ch3ck My C0de</Link></h2>
            <h4>Open Code Review Platform</h4> 
          </div>
          <div className="buttons"> {buttons} </div>
          <div className="greeting">    {this.context.user ? this.context.user.username : null}
          </div>
        </div> */}
        <Navbar brand={brand} right className="navbar">
            <NavItem><Link className='link' to="/learn">Learn</Link></NavItem>
          <NavItem><Link className="link" to="/about">About</Link></NavItem>
          <NotAuthenticated>
            <NavItem><Link className='link' to="/register">Register</Link></NavItem>
            <NavItem><Link className='link' to="/login" >Log In</Link></NavItem>
          </NotAuthenticated>
          <Authenticated>
            <Link className='link' to={'/profile/'+localStorage.user_id}>Profile</Link>
            <Link className='link' to="/logout" >Log Out</Link>
          </Authenticated>
          <div className="greeting">{this.context.user ? this.context.user.username : null}</div>
        </Navbar>


        <div className = 'child'>
          {this.props.children}
        </div>
        <br /> <br/>
      </div>

  }
}

export default App;
