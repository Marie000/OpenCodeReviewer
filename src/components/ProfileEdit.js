import React, { Component } from 'react';
import { Link } from 'react-router';
import HTTP from '../services/httpservice';
import { hashHistory } from 'react-router';

export default class ProfileEdit extends Component {
  constructor() {
    super();
    this.state={
        id: '',
        first_name:'',
        last_name: '',
        user_name: '',
        location: '', 
    }
  }

  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  getUserData(){
    var scope = this;

    var data = HTTP.get('/users/me')
    .then(function(data){
        scope.setState({
        id: data._id,
        first_name:data.first_name,
        last_name: data.last_name,
        user_name: data.user_name,
        location: data.location,
        email:data.email,
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
          <input className='link button-darkgreen' type="submit" value="Submit changes" onClick={this.handleSubmit.bind(this)}></input>
      </form>
      </div>
  	</div>
  	)
  }
}