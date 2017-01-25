import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import './Dashboard.css';
import moment from 'moment';
import taglist from'../../tag-list.js';



export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      posts: [],
      page:1,
      loggedIn: (localStorage.user_id? true : false),
      search:'',
      tag:''
    }
  }

  componentWillMount(){
    this.getData(1,null,null)
    }

  getData(page,tag,search){
    var scope = this;
    var query= '?page='+page;
    if(tag){
      query+='&tag='+tag;
    } else if(search){
      query+='&search='+search
    }


    var data = HTTP.get('/documents'+query)
      .then(function(data){
        //     console.log(data);
          scope.setState({
            posts: data,
            loggedIn: (localStorage.user_id ? true : false)
          })
      })
  }

  nextPage(){
    this.getData(this.state.page+1,this.state.tag,this.state.search)
    this.setState({page:this.state.page+1})
  }

  firstPage(){
    this.getData(1,this.state.tag,this.state.search)
    this.setState({page:1})
  }

  previousPage(){
    if(this.state.page>1) {
      this.getData(this.state.page - 1,this.state.tag,this.state.search)
      this.setState({page: this.state.page - 1})
    }
  }

  selectTag(tag){
    this.getData(1,tag,null);
    this.setState({page:1,tag:tag})
  }

  getBySearch(e){
    e.preventDefault();
    this.getData(1,null,this.state.search);
    this.setState({page:1});
  }

  handleSearchInput(e){
    this.setState({search:e.target.value});
  }

  seeAll(){
    this.getData(1);
    this.setState({page:1, search:'',tag:''})
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
    <p className='main-title'> Posted Questions </p>

    <form className="text mrgTop10 mrgBtm10" onSubmit={this.getBySearch.bind(this)}>Search: 
      <input type="text" onChange={this.handleSearchInput.bind(this)} />
      <input className='' type="submit"/>
    </form>

    <p className="text"> Filter by tag: {taglist.map((tag)=>{return <button className='tags' onClick={this.selectTag.bind(this,tag)}>{tag}</button> }) }  </p>
    <button className='tags mrgTop0' onClick={this.seeAll.bind(this)}>Clear Filters</button>

    <ul>
  		{this.state.posts.map(post => { return (
  			<li className='post'>
  				<Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
  				<br/>

          {
            post.tags.map(tag => {
              return <div className="tags dashboard-tags" onClick={this.selectTag.bind(this,tag)}> {tag} </div>
            })
          }
          <div className="mrgTop10 mrgBtm10">
 				  Posted by <span className="red"> <Link className='link' to={'/profile/'+post._author._id}>{post._author.user_name}</Link></span> on {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
  			</div>
   			</li>
   			)}
  		)}
    </ul>

    <button className='button-darkgreen-small inline-blk mrgRight10' onClick={this.firstPage.bind(this)}>First Page</button>
    <button  className='button-darkgreen-small inline-blk mrgRight10' onClick={this.previousPage.bind(this)}>Previous Page</button>
    <button  className='button-darkgreen-small inline-blk' onClick={this.nextPage.bind(this)}>Next Page</button>
  	</div>
  	)
  }
}