import React from 'react';
import ReactDOM from 'react-dom';
import { Route, hashHistory, Redirect } from 'react-router';
import ReactStormpath, { Router, AuthenticatedRoute, LoginLink, LogoutRoute } from 'react-stormpath';

ReactStormpath.init({
  endpoints: {
    baseUri: 'http://localhost:9000'
  }
});

import App from './components/App';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfileEdit';
import Post from './components/Post';
import NewPost from './components/NewPost';
import LogIn from './components/LogIn';
import SignIn from './components/SignIn';
import About from './components/About';
import Learn from './components/Learn/Learn';
import LearnCode from './components/Learn/Learn-Code';
import LearnCodeContent from './components/Learn/Learn-Code-Content';
import RegistrationPage from './components/RegistrationPage';
import ResetPassword from './components/ResetPassword';


import './index.css';


ReactDOM.render((
  <Router history={hashHistory}>
  <Redirect from="/" to="/dashboard" />
    <Route path="/" component={App}>
    	<Route path="/profile/:userId" component={Profile}/>
      <Route path="/editprofile" component={ProfileEdit}/>
      <Route path="/register" component={RegistrationPage} />
      <Route path="/signin" component={SignIn}/>
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
      <LogoutRoute path='/logout' redirectTo="/login" />
    </Route>  	
  </Router>
), document.getElementById('root'))


