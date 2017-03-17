import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router';
import _ from 'lodash';
import axios from 'axios';
import {Card, Dialog, FlatButton} from 'material-ui';

import config from '../../../config';
const api=config.api || '';

export default class Comment extends Component{
  constructor(props){
    super(props)
    this.state={
      thankButton:true,
      alreadyThanked:false,
      dialogOpen:false
    }
  }

  static contextTypes = {
    user: React.PropTypes.object
  };

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

  deleteComment(){
    this.setState({dialogOpen:true})
  }

  confirmDelete(){
    axios.delete(api+'/api/comments/'+this.props.comment._id,{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then((res)=>{
        this.props.reload()
      })
    this.setState({dialogOpen:false})
  }

  cancelDelete(){
    this.setState({dialogOpen:false})
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
          open={this.state.dialogOpen}
          onRequestClose={this.cancelDelete.bind(this)}
        >
          <FlatButton
            label="Cancel"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.cancelDelete.bind(this)}
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
          {myComment ? <i className="fa fa-trash-o"
                           aria-hidden="true"
                           onClick={this.deleteComment.bind(this,comment)}
          /> : null }
        </div>
        <div className="comment-text"> {comment.text} </div>
         <span className="hearts">{this.state.thankButton ? this.state.alreadyThanked ? fullHeart: emptyHeart : null}</span>

      </Card>
    )
  }
}