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
      contact_info:{},
        me: false,
      badges: []
    }
  }

  getUserData(){
    var scope = this;

    if (this.state.id === localStorage.user_id){
      var data = HTTP.get('/users/me')
      .then(function(data){
        scope.setState({
        me: true,
        first_name:data.first_name,
        last_name: data.last_name,
        user_name: data.user_name,
        email: data.email,
        location: data.location,
          contact_info:data.contact_info,
          badges:data.points.awards || []
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
          contact_info:data.contact_info,
          badges: data.points.awards || []
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
      badges = this.state.badges.map((badge)=><img src={"/badges/"+badge.name.toLowerCase()+'-'+badge.count+'.png'} width="250"/>)
    }

    var github_username;
    if(_.find(this.state.contact_info.social_media,{media:'github'})){
      github_username =_.find(this.state.contact_info.social_media,{media:'github'}).username
    }

    var github_url;
    if(_.find(this.state.contact_info.social_media,{media:'github'})){
      github_url =_.find(this.state.contact_info.social_media,{media:'github'}).url
    }

    var facebook;
    if(_.find(this.state.contact_info.social_media,{media:'facebook'})){
      facebook =_.find(this.state.contact_info.social_media,{media:'facebook'}).url
    }

    var twitter;
    if(_.find(this.state.contact_info.social_media,{media:'twitter'})){
      twitter =_.find(this.state.contact_info.social_media,{media:'twitter'}).url
    }

    var linkedIn;
    if(_.find(this.state.contact_info.social_media,{media:'linkedIn'})){
      linkedIn =_.find(this.state.contact_info.social_media,{media:'linkedIn'}).url
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
        Github Username: {github_username}
        <br/>
        <a href={facebook}><i className="fa fa-facebook fa-2x"></i></a>
        <a href={github_url}><i className="fa fa-github fa-2x"></i></a>
        <a href={twitter}><i className="fa fa-twitter fa-2x"></i></a>
        <a href={linkedIn}><i className="fa fa-linkedin fa-2x"></i></a>
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

