import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import { hashHistory } from 'react-router';
import _ from 'lodash';


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state={
        id: this.props.params.userId,
        first_name:'',
        last_name: '',
        user_name: '',
        location: '',
        email: '',
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

    if (this.state.id === localStorage.user_id){
      HTTP.get('/users/me')
      .then(function(data){
        scope.setState({
        me: true,
        first_name:data.first_name,
        last_name: data.last_name,
        user_name: data.user_name,
        email: data.email,
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
      var data = HTTP.get('/users/'+this.state.id)
      .then(function(data){
        scope.setState({
          first_name:data.first_name,
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
      button = <Link className='link' to="/editprofile" ><button className='button-darkgreen'>Edit your profile</button></Link>
    }

    var email;
    if (this.state.me){
      email = <span>Email Address: {this.state.email}<br/></span>
    }

    var profileTitle;
    if (this.state.me){
      profileTitle = "Your profile"
    } else {
      profileTitle = <span>{this.state.user_name }'s profile</span>
    }

    var badges;
    if(this.state.badges.length>0){
      badges = this.state.badges.map((badge)=><img key={badge.name+badge.count} src={"/badges/"+badge.name.toLowerCase()+'-'+badge.count+'.png'} width="250"/>)
    }


  	return(
  	<div>
      <button className='link button-darkgreen inline-blk' onClick={hashHistory.goBack}>Back</button>
      <br/>
      <div className='profile-container'>
        <h1>{profileTitle} </h1> 

        User Name:  {this.state.user_name } <br/>
        First Name:  {this.state.first_name} <br/>
        Last Name:  {this.state.last_name} <br/>
        Location:  {this.state.location}<br/>
        Github Username: {this.state.github_username}
        <br/>
        {this.state.facebook_url ? <a href={this.state.facebook_url}><i className="fa fa-facebook fa-2x" /></a> : null}
        {this.state.github_url ? <a href={this.state.github_url}><i className="fa fa-github fa-2x" /></a> : null}
        {this.state.twitter_url ? <a href={this.state.twitter_url}><i className="fa fa-twitter fa-2x" /></a> : null}
        {this.state.linkedIn_url ? <a href={this.state.linkedIn_url}><i className="fa fa-linkedin fa-2x" /></a> : null}
        <br />
        {email}
        {badges}

        {}

        {button}
      </div>
  	</div>
  	)
  }
}

