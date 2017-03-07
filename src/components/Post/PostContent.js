import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import $ from 'jquery';
import axios from 'axios';

import config from '../../../config';
const api = config.api || '';
import {FlatButton,Card} from 'material-ui';

import CommentForm from './CommentForm';
import PostCommentList from './PostCommentList';

import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';

import languageList from '../../services/codemirror-languages';


export default class PostContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inlineComments: false,
      currentComment:{
        text: '',
        language:'text'
      }
    }
  }

  componentWillMount(){
    window.setTimeout(function () {
      this.getInlineComments()
    }.bind(this), 500);
  }

  componentWillReceiveProps(nextProps){
   // this.getInlineComments()
  }

  handleChange (e) {
    var comment = e.target.value;
    this.setState({
      currentComment:{
        text:comment
      }
    });
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
    this.props.comments.map(comment => {
      if (comment.position) {
        this.setState({inlineComments:true})
        window.setTimeout(function(){
          this.displayInlineComment(comment, comment.position);
        }.bind(this), 50);
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
      _document_id: this.props.title.length>0 ? null : this.props.id,
      _file_id: this.props.title.length>0 ? this.props.id : null
    }

    this.state.currentComment.widget.clear();

    axios.post(api+'/api/comments/', dataToSend, {headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(()=>{
        dataToSend._author = {}
        dataToSend._author.user_name = localStorage.user_name;
        dataToSend.createdAt = new Date();
        this.setState({
          currentComment: {
            firstLine: null,
            lastLine: null,
            widget: null
          },
          inlineComments:true
        })
        this.displayInlineComment(dataToSend, dataToSend.position)
      })
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
    var codemirrorMode="text";
    languageList.forEach((language)=>{
      if(language[0]===this.state.language){
        codemirrorMode = language[1]
      }
    });

    var options = {
      lineNumbers: true,
      mode: codemirrorMode,
      matchBrackets: true,
      closebrackets: true,
      readOnly: true
    }

    $(".selection").parents('.CodeMirror-line').addClass('selection-background');

    return (
      <Card className={this.props.title ? "fileContent" : "documentContent" }>
        {this.props.title ? <h2>{this.props.title}</h2> : null}
        <div className="fileContentAfterTitle">

          {this.props.auth.getToken() ?
            <div className="inline-instructions">
              {this.state.currentComment.widget ?
                <div>
                  <FlatButton className='button link' onClick={this.saveComment.bind(this)} > Save comment </FlatButton>
                  <FlatButton className='button link' onClick={this.cancelWidget.bind(this)} > Cancel </FlatButton>
                </div>
                :
                <div>
                  To post an inline comment, select the part of code that you wish to comment and press
                  <FlatButton className='button link' onClick={this.addWidget.bind(this)} > Add inline comment </FlatButton>
                </div>
              }
            </div>
            : null }
        <div className="codemirror-wrapper"><CodeMirror value={this.props.text} ref="codemirror" options={options} /></div>


        {this.state.inlineComments ?
          <div> {this.state.commentsHidden ?
            <FlatButton className='button link inline-blk pull-right mrgTop10 mrgLeft10 mrgRight10' onClick={this.showComments.bind(this)} > Show inline comments </FlatButton>
            :
            <FlatButton className='button link inline-blk pull-right mrgTop10 mrgLeft10 mrgRight10' onClick={this.hideComments.bind(this)} > Hide inline comments </FlatButton>
          }  </div> : null
        }

        <div className='post-title mrgBtm20 inline-blk clearfix '>
          Posted by <span className='red'> <Link className='link' to={'/profile/'+this.state.author_id}>{this.state.author}</Link> </span>
          on {moment(this.state.postCreationDate).format("MMMM Do YYYY, h:mm:ss a")}
        </div>


        {this.props.title ?
          <div>
            <h3>Comments on {this.props.title}</h3>
            <PostCommentList comments={this.props.comments} reload={this.props.reload} auth={this.props.auth}  />

            {this.props.auth.getToken() ?
              <div>
                <CommentForm
                  file_id={this.props.file_id}
                  doc_id={this.props.doc_id}
                  reload={this.props.reload}
                  fileSpecific={true}
                  auth={this.props.auth}
                />
              </div>
            : null }
          </div>
         : null}
        </div>

      </Card>
    )
  }

}