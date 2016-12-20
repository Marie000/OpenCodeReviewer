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
      <li className='menu-link'> <Link className='link' to="/dashboard">Back</Link> </li>
      <br/>
      <strong>Your profile </strong> <br/>

      First Name: {this.state.first_name} <br/>
      Last Name: {this.state.last_name} <br/>
      User Name: {this.state.user_name } <br/>
      Location: {this.state.location}<br/>
      Email Address: {this.state.email}<br/>

      <button className='menu-link'><Link className='link' to="/editprofile" >Edit your profile</Link></button>
      
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