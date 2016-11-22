import React, { Component } from 'react';
import HTTP from '../services/httpservice';


export default class Post extends Component {
  constructor() {
    super();
    this.state = { 
    	id: null,
    	title:'',
    	author: '',
    	tags: []
    }
  }

  componentWillMount(){
    var scope = this;
    scope.setState({
          id: this.props.params.postId,
        })
    var data = HTTP.get('/postId?id='+this.props.params.postId)
    .then(function(data){
        scope.setState({
          title:data.title,
          author:data.author,
          tags: data.tags
        })
      })
    } 

  render() {
    return (
      <div>
        <h2>Title: {this.state.title}</h2>
        <p>Author: {this.state.author}</p>
        <p>Tags: {this.state.tags}</p>
      </div>
    )
  }

}