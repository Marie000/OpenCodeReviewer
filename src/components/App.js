import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';
//import { Authenticated, NotAuthenticated } from 'react-stormpath';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Toolbar,FlatButton,Paper} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

   static contextTypes= {
    router: React.PropTypes.object.isRequired,
     //user: React.PropTypes.object
  }

  render() {

    let brand = <div className="brand"> <Link to="/dashboard"><h2>Ch3ck My C0de</h2>
      <h3>Open Code Review Platform</h3></Link>
    </div>

    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance to children
      })
    }


      return <MuiThemeProvider><div className="App">

        <Paper className="navbar">
          {brand}
          <FlatButton className="button"><Link className='link' to="/learn">Learn</Link></FlatButton>
          <FlatButton className="button"><Link className="link" to="/about">About</Link></FlatButton>
          <FlatButton className="button"><Link className='link' to="/login" >Log In</Link></FlatButton>
          <FlatButton className="button"><Link className='link' to={'/profile/'+this.props.route.auth.getProfile().email}>Profile</Link></FlatButton>
          <FlatButton className="button"><Link className='link' to="/logout" >Log Out</Link></FlatButton>
          {/* <div className="greeting">{this.context.user ? this.context.user.username : null}</div> */}
        </Paper>


        <div className = 'child'>
          {children}
        </div>

      </div></MuiThemeProvider>

  }
}

export default App;
