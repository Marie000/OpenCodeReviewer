import React, { Component } from 'react';
import HTTP from '../services/httpservice';
import Moment from 'moment';

import Code from './Code.js'


export default class NewPost extends Component {


  constructor() {
    super();

    this.state = { 
    	title: '',
      tags: [],
      comments:[],
      submit: false,
      text: 'initial'
    }
  }

  getState(){

    var data = this.state;
    delete data.submit;
    return data
  }

 static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  handleChange (input, e) {
    var change = {};
    change[input] = e.target.value;
    this.setState(change);
  }

  saveCode(data){
    this.setState({
      submit:false,
      text: data
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({submit:true});

        

  window.setTimeout(function () {

    var data = this.getState();
    if (data.tags != ""){
      data.tags = data.tags.split(',');
    }
    HTTP.post('/documents', data);
    }.bind(this), 10); 

  window.setTimeout(function () {  
      this.context.router.push('/dashboard');
    }.bind(this), 600); 
  }


  render() {
    return (
      <div className='new-post-form'>
      <form onSubmit={this.handleSubmit.bind(this)}>
          <label> Title: </label>
          <input type="text" name="title" value={this.state.title} 
                             onChange={this.handleChange.bind(this, 'title')}>
          </input> <br/>        
          <br/>
          <label> Tags: </label>
          <input type="text" name="tags"  value={this.state.tags} 
                             onChange={this.handleChange.bind(this, 'tags')}>
          </input><br/>
          <Code saveCode={this.saveCode.bind(this)} submit = {this.state.submit} > </Code>
          <input type="submit" value="Submit your code" ></input>
      </form>
      <br/>
      </div>
    )
  }

}