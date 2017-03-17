import React, { Component } from 'react';
import '../Dashboard.css';

import axios from 'axios';
import PostList from '../PostList';
import {FlatButton,Tabs,Tab} from 'material-ui';


import config from '../../../config';
const api = config.api || 'http://checkmycode.ca';

export default class UserPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      reviews:[],
      page:1,
      user: this.props.user || this.props.params.userId,
      docToDelete:{},
      dialogOpen:false
    }
  }

  componentWillMount(){
    this.getData(1)
  }

  getData(page){
    var scope = this;
    var query= '?page='+page+'&author='+this.state.user;

    axios.get(api+'/api/documents'+query)
      .then((res)=>{
        console.log(res)
        res.data.filter((item)=>{return item.title!==undefined || null})
        scope.setState({posts:res.data})
      })

    axios.get(api+'/api/users/'+this.state.user+'/reviews')
      .then((res)=>{
        scope.setState({reviews:res.data})
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

    return(

      <div className="dashboard">
        <h1>Recent activity by {this.state.user}</h1>
        <br/>
        <Tabs>
          <Tab label="Posts">
            <br/>
            <PostList posts={this.state.posts}
                      tagClickable={false}
                      deleteDocument={this.deleteDocument.bind(this)}
                      auth={this.props.auth}
                      confirmDelete={this.confirmDelete.bind(this)}
                      docToDelete={this.state.docToDelete}
                      dialogOpen={this.state.dialogOpen}
            />

            {this.state.page===1 ? null : <FlatButton className='accent-button' onClick={this.firstPage.bind(this)}>First Page</FlatButton>}
            {this.state.page===1 ? null : <FlatButton  className='accent-button' onClick={this.previousPage.bind(this)}>Previous Page</FlatButton>}
            <FlatButton  className='btn' onClick={this.nextPage.bind(this)}>Next Page</FlatButton>
          </Tab>
          <Tab label="Posts commented on">
            <br/>
            <PostList posts={this.state.reviews}
                      tagClickable={false}
                      deleteDocument={this.deleteDocument.bind(this)}
                      auth={this.props.auth}
                      confirmDelete={this.confirmDelete.bind(this)}
                      docToDelete={this.state.docToDelete}
                      dialogOpen={this.state.dialogOpen}
            />

            {this.state.page===1 ? null : <FlatButton className='accent-button' onClick={this.firstPage.bind(this)}>First Page</FlatButton>}
            {this.state.page===1 ? null : <FlatButton  className='accent-button' onClick={this.previousPage.bind(this)}>Previous Page</FlatButton>}
            <FlatButton  className='btn' onClick={this.nextPage.bind(this)}>Next Page</FlatButton>
          </Tab>
        </Tabs>
      </div>
    )
  }
}