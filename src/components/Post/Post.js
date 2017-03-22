import React, { Component } from 'react';
import moment from 'moment';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import axios from 'axios';

import config from '../../../config';
const api = config.api || '';

import CommentForm from './Comments/CommentForm';
import PostCommentList from './Comments/CommentList';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import FileList from './FileList';
import {FlatButton} from 'material-ui';
import './post.css';

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
    	doc_id: this.props.params.postId,
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
    if(this.state.file) {
      axios.get(api + '/api/files/' + this.state.file._id)
        .then((res)=> {
          this.setState({file: res.data});
        })
    }
    this.getInlineComments();
  }

  getPostData(){
  	var scope = this;
    axios.get(api+'/api/documents/'+this.props.params.postId)
      .then(function(res){
        scope.setState({
          doc_id: res.data._id,
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

    $(".selection").parents('.CodeMirror-line').addClass('selection-background');
    return (
      <div className="form-container post-section">
      <div className="post-wrapper">
        <PostHeader title={this.state.title}
                    description={this.state.description}
                    tags={this.state.tags} />

        
        {this.state.files.length>0 ?
        <FileList files={this.state.files} getFileContent={this.getFileContent.bind(this)} />
          :
          null }
        {this.state.file_title ? <h2>{this.state.file_title}</h2> : null}

        {this.state.text || this.state.file ?
       <PostContent text={this.state.file? this.state.file.text : this.state.text}
                    title={this.state.file? this.state.file.name : ''}
                    reload={this.reloadPage.bind(this)}
                    doc_id={this.state.doc_id}
                    file_id={this.state.file ? this.state.file._id : null}
                    comments={this.state.file ? this.state.file.comments : this.state.comments}
                    auth={this.props.auth}
       /> : null }
        <br/><br/>
        <h2 className="post-title mrgTop10 mrgBtm20"> {this.state.file ? "Comments on the whole project: ":"Comments"}  </h2>
        <PostCommentList
          comments={this.state.comments.filter((comment)=>!comment._file_id)}
          reload={this.reloadPage.bind(this)}
          auth={this.props.auth}
        />
        
        {this.props.auth.getToken() ?
          <form >
            <CommentForm
              doc_id={this.props.params.postId}
              reload={this.reloadPage.bind(this)}
              fileSpecific={false}
              auth={this.props.auth}
            />
          </form>
         : null }
      
      </div>
        </div>

    )
  }

}