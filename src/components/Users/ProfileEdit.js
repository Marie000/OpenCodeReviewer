import React, { Component } from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import _ from 'lodash';
import axios from 'axios';
import config from '../../../config';
const api = config.api || '';
import {FlatButton} from 'material-ui';

export default class ProfileEdit extends Component {
  constructor() {
    super();
    this.state={
        id: '',
        first_name:'',
        last_name: '',
        location: '',
        github_username:'',
        github_url:'',
        facebook_url:'',
        twitter_url:'',
        linkedIn_url:''
    }
  }

  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  getUserData(){
    var scope = this;

    axios.get(api+'/api/users/me',{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
    .then(function(res){
        let data=res.data;
      console.log(data)
        scope.setState({
          id: data._id,
          first_name:data.first_name || '',
          last_name: data.last_name || '',
          location: data.location || '',
          email:data.email,
          github_username:data.github_username || '',
          github_url:data.github_url || '',
          facebook_url:data.facebook_url || '',
          twitter_url:data.twitter_url || '',
          linkedIn_url:data.linkedIn_url || ''
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

    var data = this.state;
    axios.patch(api+'/api/users/me', data,{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(()=>{
        this.context.router.push('/profile/'+this.state.email);
      })
  }

  render(){
    console.log(this.state)
  	return(
  	<div className="profile-section">
      <FlatButton className='link button inline-blk' onClick={hashHistory.goBack}>Back</FlatButton>
  		<div className='profile-container'>
      <form>
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

          <label> Github username: </label>
        <input type="text" name="github_username" value={this.state.github_username}
               onChange={this.handleChange.bind(this,'github_username')} />
        <br/>

        <label>Github Url:</label>
        <input type="text" name="github_url" value={this.state.github_url}
               onChange={this.handleChange.bind(this,'github_url')} />
        <br/>

        <label>Facebook:</label>
        <input type="text" name="facebook_url" value={this.state.facebook_url}
               onChange={this.handleChange.bind(this,'facebook_url')} />
        <br/>

        <label>Twitter:</label>
        <input type="text" name="twitter_url" value={this.state.twitter_url}
               onChange={this.handleChange.bind(this,'twitter_url')} />
        <br/>

        <label>LinkedIn:</label>
        <input type="text" name="linkedIn_url" value={this.state.linkedIn_url}
               onChange={this.handleChange.bind(this,'linkedIn_url')} />
        <br/>


          <FlatButton id="submit-button"
                      className='button'
                      type="submit"
                      value="Submit changes"
                      onClick={this.handleSubmit.bind(this)}>
            Submit </FlatButton>
      </form>

      </div>
  	</div>
  	)
  }
}