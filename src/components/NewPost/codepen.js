import React, { Component } from 'react';
import ReactSelectize from "react-selectize";
import {FlatButton, TextField} from 'material-ui';
var SimpleSelect =  ReactSelectize.SimpleSelect;
import axios from 'axios';

import config from '../../../config';
const api = config.api || '';

export default class Github extends Component {
  constructor(props) {
    super(props);
    this.state={
      css_ext:'css',
      html_ext:'html',
      js_ext:'js',
      css_content:'',
      html_content:'',
      js_content:'',
      base_url:''
    }
  }

  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  handleUrl (e) {
    this.setState({base_url:e.target.value});
  }
  
  createFile(text,type,parent){
    let name;
    let language;
    switch(type){
      case 'html':
        name="index.html"
        language='html'
        break;
      case 'css':
        name="style.css";
        language='css'
        break;
      case 'js':
        name="script.js";
        language='javascript'
        break;
    }
    let newFile = {
      name:name,
      is_folder:false,
      text:text,
      language:language,
      _parent:parent
    }
    axios.post(api+'/api/files',newFile)
      .then(()=>{console.log("file created")})
  }
  
  submitUrl(e){
    e.preventDefault();
    console.log(this.state.base_url);
    let newDoc = {
      title:this.props.name,
      description:this.props.description,
      tags:this.props.tags,
      text:'',
      language:'text',
      multi_files:true
    }
    axios.post('/api/documents',newDoc, {headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then((doc)=>{
        
        axios.get(this.state.base_url+"."+this.state.html_ext)
          .then((res)=>{
            if(res.data){
              this.createFile(res.data,'html',doc.data._id)
            }
          })
        axios.get(this.state.base_url+"."+this.state.css_ext)
          .then((res)=>{
            if(res.data) {
              this.createFile(res.data, 'css', doc.data._id)
            }
          })
        axios.get(this.state.base_url+"."+this.state.js_ext)
          .then((res)=>{
            if(res.data) {
              this.createFile(res.data, 'js', doc.data._id)
            }
          })
      })
      .then(()=>{
        this.context.router.push('/dashboard');
      })
  }


  render(){
    const htmlPreprocessors = [{label:'none',value:'html'},
      {label:'markdown',value:'markdown'},
      {label:'slim',value:'slim'},
      {label:'haml',value:'haml'}];
    const cssPreprocessors = [{label:'none',value:'css'},
      {label:'scss',value:'scss'},
      {label:'sass',value:'sass'},
      {label:'less',value:'less'}];
    const jsPreprocessors = [{label:'none',value:'js'},
      {label:'coffeescript',value:'coffeescript'},
      {label:'livescript', value:'livescript'},
      {label:'typescript',value:'typescript'},
      {label:'babel',value:'babel'}];
    let scope = this;
    return(
      <div className='github-container'>
        <div> Import code from Codepen </div>
        <div className="row">
          <form className='github'>
            <div>Preprocessors: </div>
            <SimpleSelect className='full-width'
                          ref="htmlselect"
                          options={htmlPreprocessors}
                          value={{'label':scope.state.html_ext, 'value':scope.state.html_ext}}
                          onValueChange = {function(value){
                       scope.setState({html_ext: value.value});
            }}/>
            <SimpleSelect className='full-width'
                          ref="cssselect"
                          options={cssPreprocessors}
                          value={{'label':scope.state.css_ext,'value':scope.state.css_ext}}
                          onValueChange = {function(value){
                       scope.setState({css_ext: value.value});
            }}/>


            <SimpleSelect className='full-width'
                          ref="jsselect"
                          options={jsPreprocessors}
                          value={{'label':scope.state.js_ext,'value':scope.state.js_ext}}
                          onValueChange = {function(value){
                       scope.setState({js_ext: value.value});
            }}/>
        </form>
        </div>
            <br/>
    <form className="codepen-form">
      <div className="row">

            <div className="col-md-8">
              <TextField type="text"
                         name="base_url"
                         className="url-input"
                         placeholder="url from codepen"
                         value={this.state.base_url}
                         onChange={this.handleUrl.bind(this)} />
            </div>
            <div className="col-md-1">
              <FlatButton className='button'
                      type="submit"
                      onClick={this.submitUrl.bind(this)}>
                Submit
              </FlatButton>
        </div>
        </div>
      </form>
      </div>
    )
  }
}


