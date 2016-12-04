import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Post from './components/Post';
import NewPost from './components/NewPost';

import './index.css';

import { Router, Route, hashHistory } from 'react-router';



ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
    	<Route path="/profile" component={Profile}/> 
    	<Route path="/Dashboard" component={Dashboard}/> 
    	<Route path="/Dashboard/NewPost" component={NewPost}/> 
    	<Route path="/Dashboard/:postId" component={Post}/>
    </Route>  	
  </Router>
), document.getElementById('root'))

/*
ReactDOM.render(
  <App />,
  document.getElementById('root')
);*/
