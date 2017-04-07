import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Popover,Menu,MenuItem,FlatButton,Paper} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

  constructor(){
    super();
    this.state={
      profileOpen:false
    }
  }

   static contextTypes={
    router: React.PropTypes.object.isRequired,
     //user: React.PropTypes.object
  }

  openProfile(e){
    e.preventDefault()
    this.setState({profileOpen:true, anchorEl:e.currentTarget});
  }

  closeProfile(){
    this.setState({profileOpen:false})
  }

  render() {

    let brand=<div className="brand"> <Link to="/dashboard"><h2>Ch3ck My C0de</h2>
      <h3>Open Code Review Platform</h3></Link>
    </div>

    let children=null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance to children
      })
    }

    let username=this.props.route.auth.getProfile().username;
    let userid=this.props.route.auth.getProfile().id;
      return <MuiThemeProvider><div className="App">

        <Paper className="navbar">
          {brand}

          {this.props.route.auth.loggedIn() ? null :
          <FlatButton className="button" ><Link className='link' to="/login" >Log In</Link></FlatButton> }

          {this.props.route.auth.loggedIn() ?
            <FlatButton className="button" onTouchTap={this.openProfile.bind(this)}>
              <i className="fa fa-user-circle fa-2x" aria-hidden="true"/>
            </FlatButton> : null}
          <Popover
            open={this.state.profileOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.closeProfile.bind(this)}
          >
            <Menu className="profile-menu">
              <MenuItem ><Link className='link' to={'/profile/'+username}>Profile</Link></MenuItem>
              <MenuItem ><Link className='link' to={"/userPosts/"+username}>Activities</Link></MenuItem>
              <MenuItem ><Link className='link' to='/viewNetwork/'> Network </Link></MenuItem>
            </Menu>
          </Popover>

          <FlatButton className="button">
            <i className="fa fa-bell fa-2x" aria-hidden="true"></i>
          </FlatButton>

          {this.props.route.auth.loggedIn() ?
            <FlatButton className="button link" onClick={this.props.route.auth.logout.bind(this)}>
              <Link className='link' to="/logout" >Log Out</Link></FlatButton> : null }

          <FlatButton className="button"><Link className='link' to="/learn">Learn</Link></FlatButton>
          <FlatButton className="button"><Link className="link" to="/about">About</Link></FlatButton>
          {/* <div className="greeting">{this.context.user ? this.context.user.username : null}</div> */}
        </Paper>


        <div className='child'>
          {children}
        </div>

      </div></MuiThemeProvider>

  }
}

export default App;
