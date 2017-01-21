import React, { Component } from 'react';
import HTTP from '../services/httpservice';
import moment from 'moment';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';

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
      tags: [],
      author: "",
      comments:[],
      currentComment:{
        text: 'mytest',
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
          author:data._author.user_name,
          author_id: data._author._id,
          text: data.text,
          tags: data.tags,
          comments:data.comments,
          postCreationDate:data.createdAt
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

    var author;
  	
    return (
      <div className="form-container">
      <button className='link button-darkgreen inline-blk' onClick={hashHistory.goBack}>Back</button>
      <div className="post-wrapper">
        <h2>{this.state.title}</h2>

        <div className="post-title clearfix"> Tags:  {this.state.tags.map(tag => { return <div className="tags"> {tag}</div>}
            )
          }
        </div>

        <div className="clearfix mrgBtm20 font18rem">
           To post an inline comment, place the cursor on the last line of the code you wish to comment and press <button className='button-darkgreen-small link  mrgLeft10' onClick={this.addWidget.bind(this)} > Add inline comment </button>
        </div>

        <div className="codemirror-wrapper"><CodeMirror value={this.state.text} ref="codemirror" options={options} /></div>
        
        <p className='post-title mrgBtm20 '> Posted by <span className='red'> <Link className='link' to={'/profile/'+this.state.author_id}>{this.state.author}</Link> </span> on {moment(this.state.postCreationDate).format("MMMM Do YYYY, h:mm:ss a")} </p>

        

        <strong className="post-title mrgTop10 mrgBtm20"> Comments:  </strong>
        <ul >
          {this.state.comments.map(comment => { if (comment.position == null){return (
                
          <li className='comment'> 
            <div className="comment-header"> 
              <Link className='link red' to={'/profile/'+comment._author._id}>{comment._author.user_name}</Link> 
               <span className = "comment-date"> Posted on {moment(comment.createdAt).format("MMMM Do YYYY, h:mm:ss a")} </span>
            </div>
            <div className = "comment-text"> {comment.text} </div>       
          </li>

          )}
        }
        )}       
   		 </ul>
        
        <form >
        	<PostComment id={this.state.id} reload={this.reloadPage.bind(this)}></PostComment>
        </form>
      
        <button className='button-darkgreen link mrgRight10' onClick={this.saveComment.bind(this)} > Save comment </button>
      </div>
      </div>
    )
  }

}