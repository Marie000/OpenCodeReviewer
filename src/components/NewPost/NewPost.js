import React, { Component } from 'react';
import  ReactSelectize from "react-selectize";
var MultiSelect = ReactSelectize.MultiSelect;
import axios from 'axios';
import {FlatButton,TextField} from 'material-ui';
import Code from './Code';
import Codepen from './codepen';
import 'react-selectize/dist/index.css';
import taglist from '../../services/tag-list';
import Github from "./Github";
import './newpost.css';

import config from '../../../config';
const api=config.api || '';

export default class NewPost extends Component {


  constructor(props) {
    super(props);

    this.state={
    	title: '',
      tags: [],
      description:"",
      submit: false,
      text: "// Code \n\n\n\n\n\n\n\n\n\n\n\n\n",
      importGithub: false,
      importCodepen:false,
      language:'text',
      submitVisible:true
    }
  }

  getState(){
    var data = this.state;
    delete data.submit;
    return data;
  }

 static contextTypes={
    router: React.PropTypes.object.isRequired
  }

  importGithub(){
    this.setState({importGithub: true, importCodepen: false})
  }

  importCodepen(){
    this.setState({importGithub: false, importCodepen: true, submitVisible:false})
  }

  cancelGithubImport(){
    this.setState({importGithub: false, submitVisible:true})
  }
  cancelCodepenImport(){
    this.setState({importCodepen:false, submitVisible:true})
  }

  handleChange (input, e) {
    var change={};
    change[input]=e.target.value;
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
    var data={
      title: this.state.title,
      tags: this.state.tags,
      description:this.state.description,
      text: this.state.text,
      language: this.state.language
    };
    axios.post(api+'/api/documents', data,{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(()=>{
        this.context.router.push('/dashboard');
      })
  }

  removeSubmitButton(){
    this.setState({submitVisible:false})
  }

  displaySubmitButton(){
    this.setState({submitVisible:true})
  }


  render() {

    var self=this;
    var options=taglist.map(function(tag){
        return {label: tag, value: tag}
    });


    return (
     
      <div className="new-post-section">
        <div className="new-post-header">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <TextField type="text"
                     name="title"
                     className="input"
                     value={this.state.title}
                     onChange={this.handleChange.bind(this, 'title')}
                     placeholder="title"
              />
              <TextField className="input"
                         type="text"
                         name="description"
                         value={this.state.description}
                         onChange={this.handleChange.bind(this, 'description')}
                         placeholder="description"
                         multiLine={true}
                         rows={2}
              />
              <MultiSelect ref="select"
                           options={options}
                           maxValues={5}
                           className="input"
                           placeholder="Select tags"
                           value={this.state.tags}
                           createFromSearch={function(options, values, search){
                              var labels=values.map(function(value){
                                return value.label;
                              })
                              if (search.trim().length===0 || labels.indexOf(search.trim())!==-1)
                                return null;
                                return {label: search.trim(), value: search.trim()};
                              }}
                           onValuesChange={function(value){
                              var tags=[];
                              value.map(function(item){
                                tags.push(item.value);
                              });
                              self.setState({tags:tags});
                                }
                              }
              />
          </form>
          {/*GITHUB IMPORT*/}
          {this.state.importGithub ?
          <div>
            <Github saveCode={this.saveCode.bind(this)}
                    setLanguage={this.setLanguage.bind(this)}
                    removeSubmitButton={this.removeSubmitButton.bind(this)}
                    displaySubmitButton={this.displaySubmitButton.bind(this)}
                    name={this.state.title}
                    description={this.state.description}
                    auth={this.props.auth}
                    tags={this.state.tags}
            />
            <FlatButton className="button"
                        onClick={this.cancelGithubImport.bind(this)}>
              Cancel Github import</FlatButton>
          <br />
          <br />
        </div>  : null}

          {/*CODEPEN IMPORT*/}
            {this.state.importCodepen ?
              <div>
                <Codepen name={this.state.title}
                         description={this.state.description}
                         tags={this.state.tags}
                         auth={this.props.auth}
                />
                <FlatButton className="button"
                            onClick={this.cancelCodepenImport.bind(this)} >
                  Cancel Codepen import
                </FlatButton>

                <br /><br />
              </div>
              : null }

          {/*NO IMPORT*/}
            {!this.state.importCodepen && !this.state.importGithub ?
              <div>
                <div className="import-buttons">
                  <FlatButton className="button"
                              onClick={this.importGithub.bind(this)}
                              value="import" >
                  Import code from GitHub</FlatButton>
                  <FlatButton className="button"
                              onClick={this.importCodepen.bind(this)}
                              value="import">
                  Import code from Codepen</FlatButton>
                </div>

                <Code saveCode={this.saveCode.bind(this)}
                      setLanguage={this.setLanguage.bind(this)} />
              </div>
              : null }



      
      </div>

        {this.state.submitVisible ?
        <FlatButton className="button"
                    onClick={this.handleSubmit.bind(this)}
                    value="Submit" >
          Submit</FlatButton>
          : null }

        <br /><br /><br />
      </div>
    )
  }

}