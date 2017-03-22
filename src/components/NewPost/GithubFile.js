import React, {Component} from 'react';
import {toIgnore} from './Github-repo';


export default class GithubFile extends Component {
  constructor(props){
    super(props);
    this.state={
      rejected:false
    }
  }
  componentWillMount(){
    if(!toIgnore[this.props.path]){
      toIgnore[this.props.path]=[]
    }
    if(toIgnore[this.props.path].indexOf(this.props.file.name)>-1){
      this.setState({rejected:true})
    } else {
      this.setState({rejected:false})
    }
  }

  componentWillReceiveProps(nextProps){
    if(!toIgnore[nextProps.path]){
      toIgnore[nextProps.path]=[]
    }
    if(toIgnore[nextProps.path].indexOf(nextProps.file.name)>-1){
      this.setState({rejected:true})
    } else {
      this.setState({rejected:false})
    }
  }

  addFile(){
    let path = 'defaultList'
    if(this.props.path){
      path=this.props.path
    } 
    let index = toIgnore[path].indexOf(this.props.file.name)
    toIgnore[path].splice(index,1);
    this.setState({rejected:false})
  }

  removeFile(){
    let path = 'defaultList'
    if(this.props.path){
      path=this.props.path
    }
    toIgnore[path].push(this.props.file.name);
    this.setState({rejected:true})
  }
  
  render() {
    console.log(toIgnore)
    let file = this.props.file;
    let checkbox = <span>
      {this.state.rejected ? <i onClick={this.addFile.bind(this)} className="fa fa-times fa-2x" style={{color:'red'}} />:
        <i onClick={this.removeFile.bind(this)} className="fa fa-check fa-2x" />}
      </span>
    if (file.type === 'file') {
      return (
        <div>
          {this.props.importRepo ? checkbox : null}
        <span className='github-file' onClick={this.props.selectFile.bind(this,file.path)}>
          <i className="fa fa-file-code-o" aria-hidden="true"/>
          {" " + file.name}</span>
          </div>
      )
    } else {
      return (
        <div>
          {this.props.importRepo ? checkbox: null}
        <span className='github-folder' onClick={this.props.resolvePath.bind(this,file.path)}>
          <i className="fa fa-folder" aria-hidden="true"/>
          {" " + file.name}</span>
          </div>
      )
    }
  }
}