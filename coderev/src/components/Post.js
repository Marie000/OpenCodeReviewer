import React, { Component } from 'react';
import HTTP from '../services/httpservice';


export default class Post extends Component {
  constructor() {
    super();
    this.state = { 
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
          code: data.code,
          tags: data.tags,
          date_submited:data.date_submitted
        })
      })
    } 

  render() {
    return (
      <div>
        <h2>Title: {this.state.title}</h2>
        <p> Code: {this.state.code}</p>
        <p>Tags: {this.state.tags}</p>
        <p> Posted on: {this.state.date_submited} by {this.state.author} </p>
      </div>
    )
  }

}