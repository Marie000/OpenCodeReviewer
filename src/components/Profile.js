import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import { hashHistory } from 'react-router';


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
        me: false
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
        location: data.location
        });
      })
    } else {
      var data = HTTP.get('/users/'+this.state.id)
      .then(function(data){
        scope.setState({
        first_name:data.first_name,
        last_name: data.last_name,
        user_name: data.user_name,
        location: data.location
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
        {email}

        {button}
      </div>
  	</div>
  	)
  }
}

/*
email: String,
  password: String (hashed),
  first_name: String,
  middle_name: String,
  last_name: String,
  user_name: String,
  code_documents: [ Code _id ],
  comments: [ Comment _id ],
  points: object (TBD),
  location: String,
  skills: [ {skill: String, experience_level: String} ],  
  contact_info: {
    public_email:String,
    social_media:[{media:String, url:String}]
  }
*/