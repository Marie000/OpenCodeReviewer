import React, { Component } from 'react';
import ReactSelectize from "react-selectize";
var SimpleSelect =  ReactSelectize.SimpleSelect;
import axios from 'axios';

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
    axios.post('/api/files',newFile)
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
    axios.post('/api/documents',newDoc)
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
        <div className='mrgBtm20 mrgTop20'> Import code from Codepen </div>
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
            <br/><br/>
            <div className="col-md-4">
              <div> Url of your codepen: </div>
            </div>
            <div className="col-md-6">
              <input type="text"
                     name="base_url"
                     value={this.state.base_url}
                     onChange={this.handleUrl.bind(this)} />
            </div>
            <div className="col-md-1">
              <button className='button-darkgreen-small'
                      type="submit"
                      onClick={this.submitUrl.bind(this)}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}


