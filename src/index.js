import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, Redirect } from 'react-router';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfileEdit';
import Post from './components/Post';
import NewPost from './components/NewPost';
import LogIn from './components/LogIn';
import SignIn from './components/SignIn';
import About from './components/About';

import './index.css';


ReactDOM.render((
  <Router history={hashHistory}>
  <Redirect from="/" to="/dashboard" />
    <Route path="/" component={App}>
    	<Route path="/profile/:userId" component={Profile}/>
      <Route path="/editprofile" component={ProfileEdit}/>
      <Route path="/signin" component={SignIn}/>
      <Route path="/login" component={LogIn}/>  
    	<Route path="/dashboard" component={Dashboard}/> 
    	<Route path="/dashboard/NewPost" component={NewPost}/> 
    	<Route path="/dashboard/:postId" component={Post}/>
      <Route path="/about" component={About}/>
    </Route>  	
  </Router>
), document.getElementById('root'))

/*
ReactDOM.render(
  <App />,
  document.getElementById('root')
);*/
