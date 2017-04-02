import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router';
import _ from 'lodash';
import axios from 'axios';
import {Card, Dialog, FlatButton,TextField} from 'material-ui';

import config from '../../../../config';
const api=config.api || '';

export default class Comment extends Component{
  constructor(props){
    super(props)
    this.state={
      thankButton:true,
      alreadyThanked:false,
      editing:false,
      text:this.props.comment.text
    }
  }
  componentWillMount(){
    if(this.props.auth.getProfile()) {
      if (this.props.auth.getProfile().username===this.props.comment._author.username) {
        this.setState({thankButton: false});
      }
      if (_.findIndex(this.props.comment.thanks, {from: {username: this.props.auth.getProfile().username}}) > -1) {
        this.setState({alreadyThanked: true});
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(_.findIndex(nextProps.comment.thanks,{from:{username:this.props.auth.getProfile().username}})>-1){
      this.setState({alreadyThanked:true});
    }
  }

  handleThanks(){
    let reload=this.props.reload
    axios.post(api+'/api/comments/'+this.props.comment._id+'/thanks',{},{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(function(res){
        reload();
      })
  }
  confirmDelete(){
    console.log(this.props.comment)
    this.props.confirmDelete(this.props.comment)
  }

  editComment(){
    this.setState({editing:true})
  }

  handleChange(e){
    this.setState({text:e.target.value})
  }

  submitChanges(e){
    e.preventDefault();
    axios.put(api+'/api/comments/'+this.props.comment._id, {text:this.state.text}, {headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(()=>{
        this.props.reload();
        this.setState({editing:false})
      });
  }

  render(){
    let comment=this.props.comment;
    let emptyHeart=<span onClick={this.handleThanks.bind(this)}>Like this comment: <i className="fa fa-heart-o" aria-hidden="true"/>
    </span>
    let fullHeart=<i className="fa fa-heart" aria-hidden="true"/>
    let myComment = false;
    if(comment._author.username === this.props.auth.getProfile().username){
      myComment = true;
    }
    return(
      <Card className='comment' key={comment._id}>
        <Dialog
          title="Are you sure you want to delete this?"
          modal={false}
          open={this.props.dialogOpen}
          onRequestClose={this.props.cancelDelete.bind(this)}
        >
          <FlatButton
            label="Cancel"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.props.cancelDelete.bind(this)}
          />
          <FlatButton
            label="Yes, delete!"
            primary={true}
            onTouchTap={this.confirmDelete.bind(this)} // for some reason, this binds to the previous post.
            // That's why I use this.state.postToDelete in the dashboard
            // another solution would be to make a separate Post Component and handle the delete there
            // (like in the comments)
          />
        </Dialog>
        <div className="comment-header">
          <Link className='link' to={'/profile/'+comment._author.username}>{comment._author.username}</Link>
          {comment.thanks.length>0 ? <span className="hearts">{fullHeart}X{comment.thanks.length}</span> : null}
          <span className="comment-date"> Posted on {moment(comment.createdAt).format("MMMM Do YYYY, h:mm:ss a")} </span>
          {myComment ? <span> &nbsp;
            <i className="fa fa-trash-o"
               aria-hidden="true"
               onClick={this.props.deleteComment.bind(this,comment)}
            /> &nbsp;
            <i className="fa fa-edit"
               aria-hidden="true"
               onClick={this.editComment.bind(this)}
               />
            </span>
            : null }

        </div>
        {this.state.editing ?
          <div>
          <TextField className="input "
                     rows={3}
                     multiLine={true}
                     name="comment"
                     value={this.state.text}
                     onChange={this.handleChange.bind(this)} />
            <FlatButton onClick={this.submitChanges.bind(this)}>Save</FlatButton>
            </div>
        :
        <div className="comment-text"> {comment.text} </div>}
         <span className="hearts">{this.state.thankButton ? this.state.alreadyThanked ? fullHeart: emptyHeart : null}</span>

      </Card>
    )
  }
}