import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router';
import _ from 'lodash';
import axios from 'axios';

import config from '../../../config';
const api = config.api || '';

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
    console.log(this.props.comment)
    if(this.props.auth.getProfile()) {
      if (this.props.auth.getProfile().email === this.props.comment._author.email) {
        this.setState({thankButton: false});
      }
      if (_.findIndex(this.props.comment.thanks, {from: {email: this.props.auth.getProfile().email}}) > -1) {
        this.setState({alreadyThanked: true});
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(_.findIndex(nextProps.comment.thanks,{from:{email:this.props.auth.getProfile().email}})>-1){
      this.setState({alreadyThanked:true});
    }
  }

  handleThanks(){
      let reload = this.props.reload
      axios.post(api+'/api/comments/'+this.props.comment._id+'/thanks',{},{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
        .then(function(res){
          reload();
        })
  }
  
  render(){
    let comment = this.props.comment;
    let emptyHeart = <span onClick={this.handleThanks.bind(this)}>Like this comment: <i className="fa fa-heart-o" aria-hidden="true"></i>
    </span>
    let fullHeart = <i className="fa fa-heart" aria-hidden="true"/>
    return(
      <li className='comment' key={comment._id}>
        <div className="comment-header">
          <Link className='link red' to={'/profile/'+comment._author.email}>{comment._author.email}</Link>
          {comment.thanks.length>0 ? <span>{fullHeart}X{comment.thanks.length}</span> : null}
          <span className = "comment-date"> Posted on {moment(comment.createdAt).format("MMMM Do YYYY, h:mm:ss a")} </span>
        </div>
        <div className = "comment-text"> {comment.text} </div>
         {this.state.thankButton ? this.state.alreadyThanked ? fullHeart: emptyHeart : null}

      </li>
    )
  }
}