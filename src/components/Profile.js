import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';

export default class Profile extends Component {
  constructor() {
    super();
    this.state={
        first_name:'',
        last_name: '',
        user_name: '',
        location: ''
    }
  }


  getUserData(){
    var scope = this;

    var data = HTTP.get('/users/me')
    .then(function(data){
        scope.setState({
        first_name:data.first_name,
        last_name: data.last_name,
        user_name: data.user_name,
        email: data.email,
        location: data.location
        });
      })



  }

  componentWillMount(){
    this.getUserData()
    } 


  render(){
  	return(
  	<div>
      <Link className='link button-darkgreen inline-blk' to="/dashboard"> Back</Link>
      <br/>
      <div className='profile-container'>
        <strong>Your profile </strong> <br/><br/>

        First Name:  {this.state.first_name} <br/>
        Last Name:  {this.state.last_name} <br/>
        User Name:  {this.state.user_name } <br/>
        Location:  {this.state.location}<br/>
        Email Address:  {this.state.email}<br/>

        <Link className='link' to="/editprofile" ><button className='button-darkgreen'>Edit your profile</button></Link>
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