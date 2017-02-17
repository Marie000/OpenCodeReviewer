import React, { Component } from 'react';
import  ReactSelectize from "react-selectize";
var MultiSelect = ReactSelectize.MultiSelect;
var SimpleSelect =  ReactSelectize.SimpleSelect;
import axios from 'axios';

import Code from './Code';
import 'react-selectize/dist/index.css';
import taglist from '../../services/tag-list';
import Github from "./Github";


export default class NewPost extends Component {


  constructor() {
    super();

    this.state = { 
    	title: '',
      tags: [],
      description:"",
      submit: false,
      text: 'initial',
      importGithub: false,
      language:'text'
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

  importCode(){
    this.setState({importGithub: true})
  }

  cancelGithubImport(){
    this.setState({importGithub: false})
  }

  handleChange (input, e) {
    var change = {};
    change[input] = e.target.value;
    this.setState(change);
  }

  saveCode(text){
    this.setState({text: text});
  }

  setLanguage(language){
    this.setState({language:language});
  }

  handleSubmit(e) {
    e.preventDefault();
    var data = {
      title: this.state.title,
      tags: this.state.tags,
      description:this.state.description,
      text: this.state.text,
      language: this.state.language
    };
    axios.post('/api/documents', data)
      .then(()=>{
        this.context.router.push('/dashboard');
      })
  }


  render() {

    var self = this;
    var options = taglist.map(function(tag){
        return {label: tag, value: tag}
    });


    return (
     
      <div >
      

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
          <textarea className="input" type="text" name="description" value={this.state.description} 
                             onChange={this.handleChange.bind(this, 'description')}>
          </textarea>
        </div>

        <div className='form-item clearfix'>

          <label> Tags: </label>
          <MultiSelect ref="select" options = {options} maxValues={5} placeholder = "Select tag"
            value = {this.state.tags}
           createFromSearch = {function(options, values, search){
                var labels = values.map(function(value){ 
                    return value.label; 
                })
                if (search.trim().length == 0 || labels.indexOf(search.trim()) != -1) 
                    return null;
                return {label: search.trim(), value: search.trim()};
            }} 
            onValuesChange={function(value){
              var tags = [];
              value.map(function(item){
                tags.push(item.value);
              });
              self.setState({tags:tags});             
            }}
          ></MultiSelect>
          </div>
      </form>
          <div>        
           
      {this.state.importGithub ? 
        <div>
          <Github saveCode={this.saveCode.bind(this)} setLanguage={this.setLanguage.bind(this)} />
          <button className="button-darkgreen-small mrgBtm10" onClick={this.cancelGithubImport.bind(this)} >Cancel Github import</button>
        </div>  
          :
        <div>  
          <button className="button-darkgreen-small mrgBtm10" onClick={this.importCode.bind(this)} value="import" >Import code from GitHub</button>
          <Code saveCode={this.saveCode.bind(this)} setLanguage={this.setLanguage.bind(this)} />
        </div>  
        }      
      
      </div>

      <button className="button-darkgreen-small" onClick={this.handleSubmit.bind(this)} value="Submit" >Submit</button>
               
      </div>
     </div>
    )
  }

}