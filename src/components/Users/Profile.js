import React, { Component } from 'react';
import { Link } from 'react-router';
import UserPosts from './UserPosts';
import ProfileEdit from './ProfileEdit';
import {FlatButton,Card,Avatar,Chip} from 'material-ui';
import axios from 'axios';
import './users.css';

import config from '../../../config';
const api = config.api || '';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state={
        username: this.props.params.userId,
        id:'',
        first_name:'',
        last_name: '',
        user_name: '',
        location: '',
        me: false,
      badges: [],
        facebook_url: '',
        twitter_url:'',
        linkedIn_url:'',
        github_url:'',
        github_username:''
    }
  }

  getUserData(){
    var scope = this;

    if (this.state.username === this.props.auth.getProfile().username){
      axios.get(api+'/api/users/me',{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(function(res){
        let data=res.data;
        scope.setState({
        me: true,
        first_name:data.first_name,
        last_name: data.last_name,
        user_name: data.user_name,
        location: data.location,
          badges:data.points.awards || [],
          facebook_url: data.facebook_url,
          twitter_url: data.twitter_url,
          github_url: data.github_url,
          github_username: data.github_username,
          linkedIn_url: data.linkedIn_url
        });
      })
    } else {
      axios.get(api+'/api/users/'+this.state.username)
      .then(function(res){
        let data = res.data;
        scope.setState({
          first_name:data.first_name,
          id:data._id,
          last_name: data.last_name,
          user_name: data.user_name,
          location: data.location,
          badges: data.points.awards || [],
          facebook_url: data.facebook_url,
          twitter_url: data.twitter_url,
          github_url: data.github_url,
          github_username: data.github_username,
          linkedIn_url: data.linkedIn_url
        });
      })
    }
  }

  componentWillMount(){
    this.getUserData()
  } 

  render(){
    var button;
    if (this.state.me) {
      button = <Link className='link' to="/editprofile" ><FlatButton className='button'>Edit your profile</FlatButton></Link>
    }


    var profileTitle;
    if (this.state.me){
      profileTitle = "Your profile"
    } else {
      profileTitle = <span>{this.state.username }'s profile</span>
    }

    var badges;
    if(this.state.badges.length>0){
      badges = this.state.badges.map((badge)=>{
        return <Chip><Avatar>{badge.count}</Avatar>{badge.name}</Chip>
      })
    }


  	return(
  	<div className="profile-section">
      <br/>
      <Card className='profile-container'>
        <h1>{profileTitle} </h1> 
        <div className="profile-list">
          <div>User Name: {this.state.user_name }</div>
          <div>First Name: {this.state.first_name}</div>
        <div>Last Name:  {this.state.last_name} </div>
        <div>Location:  {this.state.location}</div>
          </div>
        {this.state.facebook_url ? <a href={this.state.facebook_url}><i className="fa fa-facebook fa-2x" /></a> : null}
        {this.state.github_url ? <a href={this.state.github_url}><i className="fa fa-github fa-2x" /></a> : null}
        {this.state.twitter_url ? <a href={this.state.twitter_url}><i className="fa fa-twitter fa-2x" /></a> : null}
        {this.state.linkedIn_url ? <a href={this.state.linkedIn_url}><i className="fa fa-linkedin fa-2x" /></a> : null}
        <br />
        <h2>Badges: </h2>
        {badges}

      </Card>
      <br/><br/>
      {this.state.username === this.props.auth.getProfile().username ?
        <ProfileEdit auth={this.props.auth} /> :
        <UserPosts user={this.props.params.userId}
                   auth={this.props.auth}
        />
      }

  	</div>
  	)
  }
}

