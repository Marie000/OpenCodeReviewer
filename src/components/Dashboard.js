import React, { Component } from 'react';
import { Link } from 'react-router';
import './Dashboard.css';
import taglist from'../services/tag-list.js';
import axios from 'axios';
import PostList from './PostList';
import {FlatButton, Card} from 'material-ui';
import  ReactSelectize from "react-selectize";
var SimpleSelect =  ReactSelectize.SimpleSelect;


import config from '../../config';
const api = config.api || 'http://checkmycode.ca';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      posts: [],
      page:1,
      search:'',
      tag:'',
      dialogOpen:false,
      docToDelete:{},
      maxPages:1
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
        let maxPages = Math.ceil(res.data.total/10)  // right now only displays 10 per page. Should become an option later.
        scope.setState({posts:res.data.docs, maxPages:maxPages})
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

  deleteDocument(doc){
    this.setState({dialogOpen:true,docToDelete:doc})
  }

  confirmDelete(doc){
    console.log(doc.title) // don't use doc unless you fix the bug. Or it will delete the wrong post!
    axios.delete(api+'/api/documents/'+this.state.docToDelete._id,{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(()=>{
        this.getData(this.state.page,this.state.tag,this.state.search)
      });
    this.setState({dialogOpen:false,docToDelete:{}})
  }

  cancelDelete(){
    this.setState({dialogOpen:false,docToDelete:{}})
  }

  render(){
    let tagList = taglist.map((tag)=>{
      return {label:tag,value:tag}
    })
  	return(

 	<div className="dashboard">
      <Link className="link" to="/dashboard/NewPost"><FlatButton className="accent-button">Submit your code</FlatButton></Link>
	  <br/>
    <h1 className='main-title'> Dashboard </h1>
 <Card className="filter-card flex-grid">

    <form className="search-form " onSubmit={this.getBySearch.bind(this)}>
      <input  type="text"
              className="search-box col"
              placeholder="search"
              value={this.state.search}
              onChange={this.handleSearchInput.bind(this)} />
      <FlatButton  className='search-button col' onClick={this.getBySearch.bind(this)}>search</FlatButton>
    </form>
   <FlatButton onClick={this.seeAll.bind(this)} className="clear-filter-button">Clear Filters</FlatButton>

     <SimpleSelect ref="simpleselect"
                   className="select-tags"
                   theme="material"
                   placeholder="tags"
                   options={tagList}
                   value={{label:this.state.tag, value:this.state.tag}}
                   onValueChange={(value)=>{
                        this.getData(1,value.value,null);
                        this.setState({page:1,tag:value.value})
                   }} />

   </Card>
    <br />
    <PostList posts={this.state.posts}
              selectTagFromPost={this.selectTagFromPost.bind(this)}
              tagClickable={true}
              auth={this.props.auth}
              deleteDocument={this.deleteDocument.bind(this)}
              cancelDelete={this.cancelDelete.bind(this)}
              confirmDelete={this.confirmDelete.bind(this)}
              dialogOpen={this.state.dialogOpen}
    />

    {this.state.page===1 ? null : <FlatButton className='btn' onClick={this.firstPage.bind(this)}>First Page</FlatButton>}
    {this.state.page===1 ? null : <FlatButton  className='btn' onClick={this.previousPage.bind(this)}>Previous Page</FlatButton>}
    {this.state.page<this.state.maxPages ?
    <FlatButton  className='btn' onClick={this.nextPage.bind(this)}>Next Page</FlatButton>
      :null}
  	</div>
  	)
  }
}