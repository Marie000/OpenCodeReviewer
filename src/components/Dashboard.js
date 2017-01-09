import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import './Dashboard.css';
import moment from 'moment';


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

 		 <Link className="link" to="/dashboard/NewPost"><button className='button-darkgreen new-post'>Post a new question</button></Link><br/>
  		<p className='main-title'> Posted questions </p>
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
 				  Posted by <span className="red">{post._author.user_name}</span> on {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
  			</div>
   			</li>
   			)}
  		)}
  		</ul>
  	</div>
  	)
  }
}