import React, { Component } from 'react';
import HTTP from '../services/httpservice';

import PostComment from './PostComment';

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    	id: this.props.params.postId,
      comments:[]
    }
  }

  getPostData(){
  	var scope = this;

  	var data = HTTP.get('/documents/'+this.state.id)
    .then(function(data){
        scope.setState({
          id: data._id,
          title:data.title,
          author:data._author.user_name,
          text: data.text,
          tags: data.tags,
          comments:data.comments
        });
      })
  }

  componentWillMount(){
    this.getPostData()
    } 

  reloadPage(){
    this.getPostData();
  }
    
  render() {

    var options = {
      lineNumbers: true,
      mode: 'javascript',
      matchBrackets: true,
      closebrackets: true
    }
  	
    return (
      <div>
        <h2>Title: {this.state.title}</h2>
        ID: {this.state.id}
        <p>Tags: {this.state.tags}</p>
        <div>Text: <CodeMirror value={this.state.text} options={options} /></div>
        <p> Comments:  </p>
        <ul>
          {this.state.comments.map(comment => { return (
            <li> {comment.text} <br/>
             Comment by {comment._author}
            </li>
          )}
        )}       
   		 </ul>
        <p> Posted by {this.state.author} </p>
        <form >
        	<PostComment id={this.state.id} reload={this.reloadPage.bind(this)}></PostComment>
        </form>
      </div>

    )
  }

}