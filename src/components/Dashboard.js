import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import './Dashboard.css';


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      posts: []
    }
  }

  componentWillMount(){
    var scope = this;
    var data = HTTP.get('/documents')
    .then(function(data){
   //     console.log(data);
        scope.setState({
          posts: data
        })
      })
    } 

  render(){

  	return(

 	<div>

 		<button className='button-darkgreen new-post'> <Link className="link" to="/dashboard/NewPost">Post a new question</Link>  </button> <br/>
  		<p className='main-title'> Posted questions </p>
  		<ul>
  		{this.state.posts.map(post => { return (
  			<li className='post'>
  				<Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
  				<br/>
  				<span className='post-label'> Author: </span> {post._author} <br/>
  				<span className='post-label'>Tags:</span> {post.tags} <br/>
  				<span className='post-label'>Date:</span> {post.date_submitted}
          <span className='post-label'>ID:</span> {post._id}
  				<br/><br/>
   			</li>
   			)}
  		)}
  		</ul>
  	</div>
  	)
  }
}