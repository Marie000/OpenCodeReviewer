import React, { Component } from 'react';
import { Link } from 'react-router';
import './Dashboard.css';
import moment from 'moment';
import taglist from'../services/tag-list.js';
import { Authenticated } from 'react-stormpath';
import axios from 'axios';
import PostList from './PostList';
import {Row,Col,Input,Icon,Button,Card,CardPanel} from 'react-materialize';



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
      <Link className="link" to="/dashboard/NewPost"><Button className='accent-button'>Submit your code</Button></Link>
    </Authenticated>
	  <br/>
    <p className='main-title'> Posted Questions </p>
 <CardPanel className="filter-card">
    <Row className="filter-header">
    <Col m={5}>
    <form className="" onSubmit={this.getBySearch.bind(this)}>

      <Input m={8}  type="text" className="search-box" label="search" value={this.state.search} onChange={this.handleSearchInput.bind(this)} >
        <Icon>search</Icon>
        </Input>
      <Button m={4}  className='search-button' onClick={this.getBySearch.bind(this)}>Submit</Button>
    </form>
    </Col>

      <Input m={5} type="select" onChange={this.selectTag.bind(this)} label="Filter by Tag" value={this.state.tag} defaultValue={this.state.tag}>
        <option value=""> </option>
        {taglist.map((tag)=>{
          return <option value={tag}>{tag}</option>
        })}
        </Input>
      <Col m={2}>
    <Button onClick={this.seeAll.bind(this)} className="clear-filter-button">Clear Filters</Button>
        </Col>
        </Row>
   </CardPanel>
    <PostList posts={this.state.posts} selectTagFromPost={this.selectTagFromPost.bind(this)} />

    {this.state.page===1 ? null : <Button className='accent-button' onClick={this.firstPage.bind(this)}>First Page</Button>}
    {this.state.page===1 ? null : <Button  className='accent-button' onClick={this.previousPage.bind(this)}>Previous Page</Button>}
    <Button  className='accent-button' onClick={this.nextPage.bind(this)}>Next Page</Button>
  	</div>
  	)
  }
}