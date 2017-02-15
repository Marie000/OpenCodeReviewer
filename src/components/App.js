import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';
import { Authenticated, NotAuthenticated } from 'react-stormpath'


class App extends Component {

   static contextTypes= {
    router: React.PropTypes.object.isRequired,
     user: React.PropTypes.object
  }

  render() {

    var buttons = (
      <ul className='menu'>
        <Link className='link' to="/learn"><li className='inline-blk button-darkgreen'>Learn</li></Link>
        <Link className='link' to="/about" ><li className='inline-blk button-darkgreen mrgLeft10'>About</li></Link>
        <NotAuthenticated>
          <Link className='link' to="/register"><li className=' mrgLeft10 inline-blk  button-darkgreen'>Register</li></Link>
          <Link className='link' to="/login" ><li className='mrgLeft10 inline-blk  button-darkgreen'>Log In</li></Link>
        </NotAuthenticated>
        <Authenticated>
          <Link className='link' to={'/profile/'+localStorage.user_id}><li className='button-darkgreen inline-blk mrgLeft10'>Profile</li></Link>
          <Link className='link' to="/logout" ><li className='mrgLeft10 button-darkgreen inline-blk'>Log Out</li></Link>
        </Authenticated>
      </ul>
    )

      return <div className="App">
        <div className="App-header">
          <div className="header-text">
            <h2> <Link className='link' to="/dashboard">Ch3ck My C0de</Link></h2>
            <h4>Open Code Review Platform</h4> 
          </div>
          <div className="buttons"> {buttons} </div>
          <div className="greeting">    {this.context.user ? this.context.user.username : null}
          </div>
        </div>
        <div>

        <div className = 'child'>
          {this.props.children}
        </div>
        <p></p>      

      
        </div>
        <br /> <br/>
      </div>

  }
}

export default App;
