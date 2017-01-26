import React, { Component } from 'react';
import HTTP from '../services/httpservice';
import moment from 'moment';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import $ from 'jquery';

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
      loggedIn: localStorage.user_id? true: false,
    	id: this.props.params.postId,
      tags: [],
      author: "",
      comments:[],
      inlineComments: false,
      currentComment:{
        text: ''
      }
    }
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
  }

  handleChange (e) {
    var comment = e.target.value;   
    this.setState({
      currentComment:{
        text:comment
      }  
    });
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
          postCreationDate:data.createdAt,
          commentsHidden: false
        });
      })
  }


  displayInlineComment(comment, selection){

    var date = moment(comment.createdAt).format("MMMM Do YYYY, h:mm:ss a")

    var codemir = this.refs.codemirror.getCodeMirror();
    var container = document.createElement("div");
    var commentText = comment.text.replace(/\r?\n/g,'<br/>');
    var firstLine = selection.firstLine +1;
    var lastLine = selection.lastLine +1;

   
    container.innerHTML = "<div class='inline-comment'><div class='inline-comment inline-comment-header'><span class='author'>"+comment._author.user_name+"</span> <span class='lines'>commented lines "+firstLine+" to "+lastLine+"</span> <span class='comment-date'> Posted on "+date+"</span></div><div class='inline-comment inline-comment-text-display' >"+ commentText+"</div></div>";

    codemir.addLineWidget(selection.lastLine, container, {
        coverGutter: false
    });
   
    var selFrom = {line: selection.firstLine, ch:0}
    var selTo = {line:selection.lastLine+1, ch:0}
    var option = {className: 'selection'}
    codemir.markText(selFrom, selTo, option);

    $(".selection").parents('.CodeMirror-line').addClass('selection-background');

  }

  getInlineComments(){
    this.state.comments.map(comment => { 
      if (comment.position) {
          this.displayInlineComment(comment, comment.position);
          this.setState({inlineComments:true})
      }
    })
  }

  addWidget(){
    var container = document.createElement("div");
    container.id = "currentCommentDiv"
    container.innerHTML = "<textarea class='inline-comment inline-comment-text' placeholder='Type your comment here' id = 'currentComment'></textarea>" ;

    var codemir = this.refs.codemirror.getCodeMirror();

   // var line = codemir.getCursor("to").line;
    var lastLine = codemir.getCursor("end").line;
    var lastch = codemir.getCursor("end").ch;
    var firstch = codemir.getCursor("first").ch;
    var firstLine = codemir.getCursor('start').line;

    var currentWidget = codemir.addLineWidget(lastLine, container, {
      coverGutter: false
    });

    this.setState({
      currentComment:{
          widget: currentWidget,
          firstLine: firstLine,
          lastLine:lastLine
//        text: document.getElementById('comment').value
      }
    })
  }

  cancelWidget(){
   // var element = document.getElementById("currentCommentDiv");

    var codemir = this.refs.codemirror.getCodeMirror();
    this.state.currentComment.widget.clear();
    this.setState({currentComment:{widget:null}})
  }

  saveComment(){
    var currentCommentText = document.getElementById('currentComment').value;

      var dataToSend={
        position: 
          {firstLine:this.state.currentComment.firstLine, 
            lastLine:this.state.currentComment.lastLine},
        text: currentCommentText,
        is_general: false,
        _document_id: this.state.id      
      }

      this.state.currentComment.widget.clear();
      console.log(dataToSend)

      HTTP.post('/comments/', dataToSend);

      dataToSend._author = {}
      dataToSend._author.user_name = localStorage.user_name;
      dataToSend.createdAt = new Date();

      window.setTimeout(function(){
        this.displayInlineComment(dataToSend, dataToSend.position)
        this.setState({
          currentComment: {
            firstLine: null,
            lastLine: null,
            widget: null
          }, 
          inlineComments: true
        })
      }.bind(this), 500);
  }
    

  hideComments(){
    $('.inline-comment').hide();
    this.setState({commentsHidden : true})
  }

  showComments(){
    this.setState({commentsHidden : false})

    window.setTimeout(function(){
     $('.inline-comment').show();
     $(".selection").parents('.CodeMirror-line').addClass('selection-background');
    }.bind(this), 50);
  }




  render() {
    var options = {
      lineNumbers: true,
      mode: 'javascript',
      matchBrackets: true,
      closebrackets: true,
      readOnly: true
    }

    $(".selection").parents('.CodeMirror-line').addClass('selection-background');
	
    return (
      <div className="form-container">
      <button className='link button-darkgreen inline-blk' onClick={hashHistory.goBack}>Back</button>
      <div className="post-wrapper">
        <h2>{this.state.title}</h2>

        <div className="post-title clearfix"> Tags:  {this.state.tags.map(tag => { return <div className="tags"> {tag}</div>}
            )}
        </div>

        {this.state.loggedIn ?
          <div className="clearfix mrgBtm20 font18rem">
          {this.state.currentComment.widget ? 
            <div>
            <button className='button-darkgreen-small link mrgRight10' onClick={this.saveComment.bind(this)} > Save comment </button>
             <button className='button-darkgreen-small link mrgRight10' onClick={this.cancelWidget.bind(this)} > Cancel </button>
             </div>
          :
            <div>
            To post an inline comment, select the part of code that you wish to comment and press 
             <button className='button-darkgreen-small link  mrgLeft10 mrgRight10' onClick={this.addWidget.bind(this)} > Add inline comment </button>
            </div>
          }
          </div>
        : null }      
        </div>

        <div className="codemirror-wrapper"><CodeMirror value={this.state.text} ref="codemirror" options={options} /></div>
   

      {this.state.inlineComments ? 
        <div> {this.state.commentsHidden ? 
        <button className='button-darkgreen-small link inline-blk pull-right mrgTop10 mrgLeft10 mrgRight10' onClick={this.showComments.bind(this)} > Show inline comments </button>
        :
        <button className='button-darkgreen-small link inline-blk pull-right mrgTop10 mrgLeft10 mrgRight10' onClick={this.hideComments.bind(this)} > Hide inline comments </button>  
        }  </div> : null
      } 

         <div className='post-title mrgBtm20 inline-blk clearfix '> Posted by <span className='red'> <Link className='link' to={'/profile/'+this.state.author_id}>{this.state.author}</Link> </span> on {moment(this.state.postCreationDate).format("MMMM Do YYYY, h:mm:ss a")} </div>
        
         <div>
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
         </div>
        
        { this.state.loggedIn? 
          <form >
            <PostComment id={this.state.id} reload={this.reloadPage.bind(this)}></PostComment>
          </form>
         : null}
      
      </div>

    )
  }

}