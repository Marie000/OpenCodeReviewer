import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import axios from 'axios';
import {Authenticated} from 'react-stormpath';

import CommentForm from './CommentForm';
import PostCommentList from './PostCommentList';
import PostContent from './PostContent';
import FileList from './FileList';

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';

import languageList from '../../services/codemirror-languages';


export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loggedIn: localStorage.user_id? true: false,
    	id: this.props.params.postId,
      tags: [],
      description:"",
      author: "",
      comments:[],
      file:null,
      inlineComments: false,
      currentComment:{
        text: '',
        language:'text'
      },
      files:[],
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
    axios.get('/api/files/'+this.state.file._id)
      .then((res)=>{
        this.setState({file:res.data});
      })
    this.getInlineComments();
  }

  getPostData(){
  	var scope = this;
    axios.get('/api/documents/'+this.props.params.postId)
      .then(function(res){
        scope.setState({
          id: res.data._id,
          title:res.data.title,
          author:res.data._author.user_name,
          author_id: res.data._author._id,
          text: res.data.text,
          description:res.data.description,
          tags: res.data.tags,
          comments:res.data.comments,
          postCreationDate:res.data.createdAt,
          commentsHidden: false,
          language:res.data.language,
          files:res.data.files || [],
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
          this.setState({inlineComments:true})
          window.setTimeout(function(){
              this.displayInlineComment(comment, comment.position);
          }.bind(this), 50);
      }
    })
  }

  getFileContent(file){
    this.setState({file:file})
  }

  render() {
    var codemirrorMode="text";
    languageList.forEach((language)=>{
      if(language[0]===this.state.language){
        codemirrorMode = language[1]
      }
    });


    $(".selection").parents('.CodeMirror-line').addClass('selection-background');
    return (
      <div className="form-container">
      <button className='link button-darkgreen-small inline-blk' onClick={hashHistory.goBack}>Back</button>
      <div className="post-wrapper">
        <h2>{this.state.title}</h2>
        <div className='row post-title'> 
          <div className='col-md-10'> {this.state.description} </div>
        </div>

        <div className='row'> 
          <div className ='col-md-10'>
            {this.state.tags.map(tag => { return <div key={tag} className="tags"> {tag}</div>}
              )}
           </div> 
        </div>
        
        {this.state.files.length>0 ? 
        <FileList files={this.state.files} getFileContent={this.getFileContent.bind(this)} />
          :
          null }
        {this.state.file_title ? <h2>{this.state.file_title}</h2> : null}

        {this.state.text || this.state.file ?
       <PostContent text={this.state.file? this.state.file.text : this.state.text}
                    title={this.state.file? this.state.file.name : ''}
                    reload={this.reloadPage.bind(this)}
                    id={this.state.file ? this.state.file._id : this.state.id}
                    comments={this.state.file ? this.state.file.comments : this.state.comments}
       /> : null }

        <strong className="post-title mrgTop10 mrgBtm20"> Comments:  </strong>
        <PostCommentList comments={this.state.comments} reload={this.reloadPage.bind(this)} />
        
        <Authenticated>
          <form >
            <CommentForm id={this.props.params.postId} reload={this.reloadPage.bind(this)} fileSpecific={false} />
          </form>
         </Authenticated>
      
      </div>
        </div>

    )
  }

}