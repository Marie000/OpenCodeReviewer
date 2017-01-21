import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import './Dashboard.css';
import moment from 'moment';


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      posts: [],
      loggedIn: (localStorage.user_id? true : false)
    }
  }

  componentWillMount(){
    var scope = this;
    var data = HTTP.get('/documents')
    .then(function(data){
   //     console.log(data);
        scope.setState({
          posts: data,
          loggedIn: (localStorage.user_id? true : false)
        })
      })
    } 

  render(){

    var postNew;
    if (this.state.loggedIn){
      postNew = <Link className="link" to="/dashboard/NewPost"><button className='button-darkgreen'>Submit your code</button></Link>
    }

  	return(

 	<div className="dashboard">
  {postNew}
	<br/>
  		<p className='main-title'> Posted Questions and Code  </p>
  		<ul>
  		{this.state.posts.map(post => { return (
  			<li className='post'>
  				<Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
  				<br/>

          {
            post.tags.map(tag => {
              return <div className="tags dashboard-tags"> {tag} </div>
            })
          }
          <div className="mrgTop10 mrgBtm10">
 				  Posted by <span className="red"> <Link className='link' to={'/profile/'+post._author._id}>{post._author.user_name}</Link></span> on {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
  			</div>
   			</li>
   			)}
  		)}
  		</ul>
  	</div>
  	)
  }
}