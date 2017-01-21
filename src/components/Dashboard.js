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
      page:1
    }
  }

  componentWillMount(){
    this.getData(1)
    }

  getData(page){
    var scope = this;
    var data = HTTP.get('/documents?page='+page)
      .then(function(data){
        //     console.log(data);
        if(data.length>0) {
          scope.setState({
            posts: data
          })
        }
      })
  }

  nextPage(){
    this.getData(this.state.page+1)
    this.setState({page:this.state.page+1})
  }

  firstPage(){
    this.getData(1)
    this.setState({page:1})
  }

  previousPage(){
    if(this.state.page>1) {
      this.getData(this.state.page - 1)
      this.setState({page: this.state.page - 1})
    }
  }

  render(){
  	return(

 	<div className="dashboard">

 		 <Link className="link" to="/dashboard/NewPost"><button className='button-darkgreen'>Post a new question</button></Link><br/>
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
    <button onClick={this.firstPage.bind(this)}>First Page</button>
    <button onClick={this.previousPage.bind(this)}>Previous Page</button>
    <button onClick={this.nextPage.bind(this)}>Next Page</button>
  	</div>
  	)
  }
}