import React, { Component } from 'react';
import { Link } from 'react-router';
import './Dashboard.css';
import moment from 'moment';
import taglist from'../services/tag-list.js';
import axios from 'axios';
import PostList from './PostList';
import {FlatButton, Card} from 'material-ui';

import config from '../../config';
const api = config.api || '';

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

    axios.get(api+'/api/documents'+query)
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
    {this.props.auth.getToken() ?
      <Link className="link" to="/dashboard/NewPost"><FlatButton className="accent-button">Submit your code</FlatButton></Link>
    : null}
	  <br/>
    <p className='main-title'> Posted Questions </p>
 <Card className="filter-card flex-grid">

    <form className="search-form " onSubmit={this.getBySearch.bind(this)}>
      <i class="fa fa-search" aria-hidden="true" />
      <input  type="text"
              className="search-box col"
              placeholder="search"
              value={this.state.search}
              onChange={this.handleSearchInput.bind(this)} />
      <FlatButton  className='search-button col' onClick={this.getBySearch.bind(this)}>search</FlatButton>
    </form>

   <form>
      <select onChange={this.selectTag.bind(this)} label="Filter by Tag" value={this.state.tag} defaultValue={this.state.tag}>
        <option value=""> </option>
        {taglist.map((tag)=>{
          return <option value={tag}>{tag}</option>
        })}
        </select>
     </form>

    <FlatButton onClick={this.seeAll.bind(this)} className="clear-filter-button">Clear Filters</FlatButton>

   </Card>
    <br />
    <PostList posts={this.state.posts} selectTagFromPost={this.selectTagFromPost.bind(this)} />

    {this.state.page===1 ? null : <FlatButton className='accent-button' onClick={this.firstPage.bind(this)}>First Page</FlatButton>}
    {this.state.page===1 ? null : <FlatButton  className='accent-button' onClick={this.previousPage.bind(this)}>Previous Page</FlatButton>}
    <FlatButton  className='btn' onClick={this.nextPage.bind(this)}>Next Page</FlatButton>
  	</div>
  	)
  }
}