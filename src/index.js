import React from 'react';
import ReactDOM from 'react-dom';
import { Route, hashHistory, Redirect } from 'react-router';
import ReactStormpath, { Router, AuthenticatedRoute, LoginLink, LogoutRoute } from 'react-stormpath';

ReactStormpath.init();

import App from './components/App';
import Dashboard from './components/Dashboard';
import Profile from './components/Users/Profile';
import ProfileEdit from './components/Users/ProfileEdit';
import Post from './components/Post';
import NewPost from './components/NewPost/NewPost';
import LogIn from './components/Users/LogIn';
import About from './components/About';
import Learn from './components/Learn/Learn';
import LearnCode from './components/Learn/Learn-Code';
import LearnCodeContent from './components/Learn/Learn-Code-Content';
import RegistrationPage from './components/Users/RegistrationPage';
import ResetPassword from './components/Users/ResetPassword';
import ChangePassword from './components/Users/ChangePassword';


import './index.css';


ReactDOM.render((
  <Router history={hashHistory}>
  <Redirect from="/" to="/dashboard" />
    <Route path="/" component={App}>
    	<Route path="/profile/:userId" component={Profile}/>
      <Route path="/editprofile" component={ProfileEdit}/>
      <Route path="/register" component={RegistrationPage} />
      <Route path="/login" component={LogIn}/>
    	<Route path="/dashboard" component={Dashboard}/>
      <AuthenticatedRoute>
        <Route path="/dashboard/NewPost" component={NewPost}/>
      </AuthenticatedRoute>
    	<Route path="/dashboard/:postId" component={Post}/>
      <Route path="/about" component={About}/>
      <Route path="/learn" component={Learn}/>
      <Route path="/learn/code" component={LearnCode}/>
      <Route path="/learn/code/:page" component={LearnCodeContent}/>
      <Route path="/forgot" component={ResetPassword} />
      <Route path="/change" component={ChangePassword} />
      <LogoutRoute path='/logout' redirectTo="/login" />
    </Route>  	
  </Router>
), document.getElementById('root'))


