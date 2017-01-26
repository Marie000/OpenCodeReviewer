import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import { hashHistory } from 'react-router';
import _ from 'lodash';

export default class ProfileEdit extends Component {
  constructor() {
    super();
    this.state={
        id: '',
        first_name:'',
        last_name: '',
        user_name: '',
        location: '',
        contact:{social_media: []},
        github_username:'',
        github_url:'',
        facebook:'',
        twitter:'',
        linkedIn:''

    }
  }

  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  getUserData(){
    var scope = this;

    var data = HTTP.get('/users/me')
    .then(function(data){

      var github_username, github_url, facebook, twitter, linkedIn;
      if(data.contact_info.social_media) {
        console.log('social_media found')
        github_username = _.find(data.contact_info.social_media, {media: 'github'}) ?_.find(data.contact_info.social_media, {media: 'github'}).username : '';
        github_url = _.find(data.contact_info.social_media, {media: 'github'}) ? _.find(data.contact_info.social_media, {media: 'github'}).url : '';
        facebook = _.find(data.contact_info.social_media, {media: 'facebook'}) ? _.find(data.contact_info.social_media, {media: 'facebook'}).url : '';
        twitter = _.find(data.contact_info.social_media, {media: 'twitter'}) ? _.find(data.contact_info.social_media, {media: 'twitter'}).url : '';
        linkedIn = _.find(data.contact_info.social_media, {media: 'linkedIn'}) ? _.find(data.contact_info.social_media, {media: 'linkedIn'}).url : '';

      }

        scope.setState({
          id: data._id,
          first_name:data.first_name,
          last_name: data.last_name,
          user_name: data.user_name,
          location: data.location,
          email:data.email,
          contact:data.contact_info,
          github_username:github_username || '',
          github_url:github_url || '',
          facebook:facebook || '',
          twitter:twitter || '',
          linkedIn:linkedIn || ''
        });
      })
    }

  componentWillMount(){
    this.getUserData()
    } 

 handleChange (input, e) {
    var change = {};
    change[input] = e.target.value;
    this.setState(change);
  }


  handleSubmit(e) {
    e.preventDefault();

    if (this.state.first_name.length>0){
      localStorage.first_name = this.state.first_name
    } else {
      localStorage.removeItem('first_name')}

    var social_media = [];
    if(this.state.github_username || this.state.github_url){
      social_media.push({
        media:'github',
        username:this.state.github_username || '',
        url:this.state.github_url || ''
      })
    }
    if(this.state.facebook){
      social_media.push({
        media:'facebook',
        url:this.state.facebook
      })
    }
    if(this.state.twitter){
      social_media.push({
        media:'twitter',
        url:this.state.twitter
      })
    }
    if(this.state.linkedIn){
      social_media.push({
        media:'linkedIn',
        url:this.state.linkedIn
      })
    }

    var data = {
      id: this.state.id,
      first_name:this.state.first_name,
      last_name: this.state.last_name,
      user_name: this.state.user_name,
      location: this.state.location,
      email:this.state.email,
      contact_info:{social_media:social_media}

    };
    HTTP.patch('/users/me', data);

    window.setTimeout(function () {  
      this.context.router.push('/profile/'+this.state.id);
    }.bind(this), 600); 
  }

  render(){
  	return(
  	<div >
      <button className='link button-darkgreen inline-blk' onClick={hashHistory.goBack}>Back</button> 
  		<div className='profile-container'>
      <form>
          <label> User Name: </label>
          <input type="text" name="user_name" disabled value={this.state.user_name} 
                              onChange={this.handleChange.bind(this, 'user_name')}>
          </input><br/>
          <label> First Name: </label>
          <input type="text" name="first_name"  value={this.state.first_name} 
                              onChange={this.handleChange.bind(this, 'first_name')}>
          </input><br/>
          <label> Last Name: </label>
          <input type="text" name="last_name"  value={this.state.last_name} 
                             onChange={this.handleChange.bind(this, 'last_name')}>
          </input><br/>
          <label> Location: </label>
          <input type="text" name="location"  value={this.state.location} 
                             onChange={this.handleChange.bind(this, 'location')}>
          </input><br/>
           <label> Email Address: </label>
          <input type="text" name="email"  value={this.state.email} 
                             onChange={this.handleChange.bind(this, 'email')}>
          </input><br/>

          <label> Github username: </label>
        <input type="text" name="github_username" value={this.state.github_username}
               onChange={this.handleChange.bind(this,'github_username')} />
        <br/>

        <label>Github Url:</label>
        <input type="text" name="github_url" value={this.state.github_url}
               onChange={this.handleChange.bind(this,'github_url')} />
        <br/>

        <label>Facebook:</label>
        <input type="text" name="facebook" value={this.state.facebook}
               onChange={this.handleChange.bind(this,'facebook')} />
        <br/>

        <label>Twitter:</label>
        <input type="text" name="twitter" value={this.state.twitter}
               onChange={this.handleChange.bind(this,'twitter')} />
        <br/>

        <label>LinkedIn:</label>
        <input type="text" name="linkedIn" value={this.state.linkedIn}
               onChange={this.handleChange.bind(this,'linkedIn')} />
        <br/>


          <input className='link button-darkgreen' type="submit" value="Submit changes" onClick={this.handleSubmit.bind(this)}/>
      </form>
      </div>
  	</div>
  	)
  }
}