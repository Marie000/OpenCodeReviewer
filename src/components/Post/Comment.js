import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router';
import _ from 'lodash';
import axios from 'axios';

export default class Comment extends Component{
  constructor(props){
    super(props)
    this.state={
      thankButton:true,
      alreadyThanked:false
    }
  }

  static contextTypes = {
    user: React.PropTypes.object
  };

  componentWillMount(){
    if(this.context.user.username===this.props.comment._author.user_name){
      this.setState({thankButton:false});
    }
    if(_.findIndex(this.props.comment.thanks,{from:{user_name:this.context.user.username}})>-1){
      this.setState({alreadyThanked:true});
    }
  }

  componentWillReceiveProps(nextProps){
    if(_.findIndex(nextProps.comment.thanks,{from:{user_name:this.context.user.username}})>-1){
      this.setState({alreadyThanked:true});
    }
  }

  handleThanks(){
      let reload = this.props.reload
      axios.post('/api/comments/'+this.props.comment._id+'/thanks')
        .then(function(res){
          reload();
        })
  }
  
  render(){
    let comment = this.props.comment;
    let button = <button onClick={this.handleThanks.bind(this)}>Thank</button>
    return(
      <li className='comment' key={comment._id}>
        <div className="comment-header">
          <Link className='link red' to={'/profile/'+comment._author._id}>{comment._author.user_name}</Link>
          {this.state.thankButton ? this.state.alreadyThanked ? 'thanked!': button : null}
          <span className = "comment-date"> Posted on {moment(comment.createdAt).format("MMMM Do YYYY, h:mm:ss a")} </span>
        </div>
        <div className = "comment-text"> {comment.text} </div>
      </li>
    )
  }
}