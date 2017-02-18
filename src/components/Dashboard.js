import React, { Component } from 'react';
import { Link } from 'react-router';
import './Dashboard.css';
import moment from 'moment';
import taglist from'../services/tag-list.js';
import { Authenticated } from 'react-stormpath';
import axios from 'axios';
import PostList from './PostList';



export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      posts: [],
      page:1,
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

    axios.get('/api/documents'+query)
      .then((res)=>{
        scope.setState({posts:res.data})
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

  selectTag(e){
    var tag = e.target.value;
    this.getData(1,tag,null);
    this.setState({page:1,tag:tag})
  }

  selectTagFromPost(tag){
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

  	return(

 	<div className="dashboard">
    <Authenticated>
      <Link className="link" to="/dashboard/NewPost"><button className='button-darkgreen'>Submit your code</button></Link>
    </Authenticated>
	  <br/>
    <p className='main-title'> Posted Questions </p>

    <form className="text mrgTop10 mrgBtm10" onSubmit={this.getBySearch.bind(this)}>Search: 
      <input type="text" value={this.state.search} onChange={this.handleSearchInput.bind(this)} />
      <input className='' type="submit"/>
    </form>

    <p className="text"> Filter by tag:
      <select onChange={this.selectTag.bind(this)} value={this.state.tag}>
        <option value=""> </option>
        {taglist.map((tag)=>{
          return <option value={tag}>{tag}</option>
        })}
        </select>
      </p>

    <button className='tags mrgTop0' onClick={this.seeAll.bind(this)}>Clear Filters</button>

    <PostList posts={this.state.posts} selectTagFromPost={this.selectTagFromPost.bind(this)} />

    <button className='button-darkgreen-small inline-blk mrgRight10' onClick={this.firstPage.bind(this)}>First Page</button>
    {this.state.page===1 ? null : <button  className='button-darkgreen-small inline-blk mrgRight10' onClick={this.previousPage.bind(this)}>Previous Page</button>}
    <button  className='button-darkgreen-small inline-blk' onClick={this.nextPage.bind(this)}>Next Page</button>
  	</div>
  	)
  }
}