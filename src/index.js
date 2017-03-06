import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, browserHistory, Redirect } from 'react-router';
//import ReactStormpath, { Router, AuthenticatedRoute, LoginLink, LogoutRoute } from 'react-stormpath';
import AuthService from './utils/AuthService';
import config from '../config';
//ReactStormpath.init();

import App from './components/App';
import Dashboard from './components/Dashboard';
import Profile from './components/Users/Profile';
import ProfileEdit from './components/Users/ProfileEdit';
import Post from './components/Post/Post';
import NewPost from './components/NewPost/NewPost';
import Login from './components/Users/LogIn';
import About from './components/About';
import Learn from './components/Learn/Learn';
import LearnCode from './components/Learn/Learn-Code';
import LearnCodeContent from './components/Learn/Learn-Code-Content';
import RegistrationPage from './components/Users/RegistrationPage';
import ResetPassword from './components/Users/ResetPassword';
import ChangePassword from './components/Users/ChangePassword';
import UserPosts from './components/Users/UserPosts';

import './index.css';

const auth = new AuthService(config.auth0audience, config.auth0url)

const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

ReactDOM.render((
  <Router history={hashHistory}>
  <Redirect from="/" to="/dashboard" />
    <Route path="/" component={App} auth={auth}>
    	<Route path="/profile/:userId" component={Profile}/>
      <Route path="/editprofile" component={ProfileEdit} onEnter={requireAuth} />
      <Route path="/register" component={RegistrationPage} />
      <Route path="/login" component={Login}/>
    	<Route path="/dashboard" component={Dashboard}/>
      <Route path="/dashboard/NewPost" component={NewPost} onEnter={requireAuth} />
    	<Route path="/dashboard/:postId" component={Post}/>
      <Route path="/about" component={About}/>
      <Route path="/learn" component={Learn}/>
      <Route path="/learn/code" component={LearnCode}/>
      <Route path="/learn/code/:page" component={LearnCodeContent}/>
      <Route path="/forgot" component={ResetPassword} />
      <Route path="/change" component={ChangePassword} />
      <Route path="/userPosts/:userId" component={UserPosts}/>
      <Route path='/logout'  /> {/*????? */}
    </Route>  	
  </Router>
), document.getElementById('root'))


