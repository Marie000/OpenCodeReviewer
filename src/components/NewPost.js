import React, { Component } from 'react';
import HTTP from '../services/httpservice';


import Code from './Code.js'


export default class NewPost extends Component {


  constructor() {
    super();

    this.state = { 
    	title: '',
      tags: [],
      description:"",
      comments:[],
      submit: false,
      text: 'initial'
    }
  }

  getState(){

    var data = this.state;
    delete data.submit;
    return data;
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
      <div className='new-post-form form-container'>
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className='form-item'>
          <label> Title: </label>
          <input type="text" name="title" value={this.state.title} 
                             onChange={this.handleChange.bind(this, 'title')}>
          </input>        
       </div>
       <div className='form-item clearfix'>
          <label> Description: </label>
          <textarea type="text" name="description" value={this.state.description} 
                             onChange={this.handleChange.bind(this, 'description')}>
          </textarea>
        </div>
        <div className='form-item'>
          <label> Tags: </label>
          <input type="text" name="tags"  value={this.state.tags} 
                             onChange={this.handleChange.bind(this, 'tags')}>
          </input>
          </div>
          <Code saveCode={this.saveCode.bind(this)} submit = {this.state.submit} > </Code>
          <button className="button-darkgreen" type="submit" value="Submit your code" >Submit your code</button>
      </form>
      <br/>
      </div>
    )
  }

}