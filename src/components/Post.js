import React, { Component } from 'react';
import HTTP from '../services/httpservice';

import PostComment from './PostComment';

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';

var textarea_style="background:yellow;width:100%;height:auto"


export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    	id: this.props.params.postId,
      comments:[],
      currentComment:{
        text: 'mytest'
      }
    }
  }

  getPostData(){
  	var scope = this;

  	var data = HTTP.get('/documents/'+this.state.id)
    .then(function(data){
        scope.setState({
          id: data._id,
          title:data.title,
          author:data._author.first_name+" "+data._author.last_name,
          text: data.text,
          tags: data.tags,
          comments:data.comments
        });
      })
  }

  displayInlineComment(comment, line){
    var codemir = this.refs.codemirror.getCodeMirror();
    var container = document.createElement("div");
    var commentText = comment.text.replace(/\r?\n/g,'<br/>');
    container.innerHTML = "<div style="+textarea_style+">"+commentText+"<br>Commented by "+comment._author.user_name+" on "+comment.createdAt.toString()+"</div>";
    codemir.addLineWidget(line, container, {
      coverGutter: false
    });
  }

  getInlineComments(){
    this.state.comments.map(comment => { 
      if (typeof comment.position == 'number') {
          this.displayInlineComment(comment, comment.position)
      }
    })
  }

  componentWillMount(){
    this.getPostData();
}

componentDidMount(){
  window.setTimeout(function () {  
       this.getInlineComments()
    }.bind(this), 500);
}
       
  reloadPage(){
    this.getPostData();
    this.getInlineComments();
    console.log(this.state.comments)
    
  }

  addWidget(){
    var container = document.createElement("div");
    container.innerHTML = "<textarea style="+textarea_style+" id = 'comment'></textarea>" ;
    var codemir = this.refs.codemirror.getCodeMirror();


    var line = codemir.getCursor("to").line
    console.log(line+1)
    codemir.addLineWidget(line, container, {
      coverGutter: false
    });
    console.log(container)
    this.setState({currentComment:{
      line:line
//      text: document.getElementById('comment').value
}
    })
  }

  handleChange (e) {
    var comment = e.target.value;   
    this.setState({
      currentComment:{
        text:comment
      }  
    });
  }

  saveComment(){
      var dataToSend={
        position: this.state.currentComment.line,
        text: document.getElementById('comment').value,
        is_general: false,
        _document_id: this.state.id
      }

      console.log(dataToSend)

      HTTP.post('/comments/', dataToSend)
  }
    
  render() {

    var options = {
      lineNumbers: true,
      mode: 'javascript',
      matchBrackets: true,
      closebrackets: true,
      readOnly: true
    }
  	

    return (
      <div>
        <h2>Title: {this.state.title}</h2>
        ID: {this.state.id}
        <p>Tags: {this.state.tags}</p>
        <div>Text: <CodeMirror value={this.state.text} ref="codemirror" options={options} /></div>
        <p> Comments:  </p>
        <ul>
          {this.state.comments.map(comment => { if (comment.position == null){return (
            <li> {comment.text} <br/>
             Comment by {comment._author.user_name}
            </li>
          )}
        }
        )}       
   		 </ul>
        <p> Posted by {this.state.author} </p>
        <form >
        	<PostComment id={this.state.id} reload={this.reloadPage.bind(this)}></PostComment>
        </form>
        <button className='button-darkgreen link mrgRight10' onClick={this.addWidget.bind(this)} > Add inline comment </button>
        <button className='button-darkgreen link mrgRight10' onClick={this.saveComment.bind(this)} > Save comment </button>
      </div>

    )
  }

}