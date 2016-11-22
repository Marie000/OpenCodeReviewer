import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      posts: []
    }
  }

  componentWillMount(){
    var scope = this;
    var data = HTTP.get('/posts')
    .then(function(data){
        console.log(data);
        scope.setState({
          posts: data
        })
      })
    } 

  render(){

  	return(

 	<div>
  		<p> Previous posts: </p>
  		<ul>
  		{this.state.posts.map(post => { return (
  			<li>
  				<Link to={'/dashboard/'+post.id}> {post.title} </Link>
  				<br/>
  				Author: {post.author} <br/>
  				Tags: {post.tags} <br/>
  				Date: {post.date_submitted}
  				<br/><br/>
   			</li>
   			)}
  		)}
  		</ul>
  	</div>
  	)
  }
}