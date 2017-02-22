import React,{Component} from 'react';
import axios from 'axios';
import _ from 'lodash';

export default class FileList extends Component {
  constructor(props){
    super(props)
    this.state={
      files:this.props.files,
      path:[],
      highlightedFile:''
    }
  }

  openFolder(file){
    if(file.name==="top"){
      this.setState({files:this.props.files,path:[]})
    } else {
      axios.get('/api/files/'+file._id)
        .then((res)=> {
          let path = this.state.path;
          if(!_.find(path,file)) {
            path.push(file);
          }
          this.setState({files: res.data.children, path: path})
        })
    }
  }

  openFile(file){
    this.setState({highLightedFile:file._id});
    this.props.getFileContent(file)
  }

  render(){
    return (
      <div>
        <span onClick={this.openFolder.bind(this,{name:'top'})}>Top </span>
        {this.state.path.map((path)=>{
          return <span onClick={this.openFolder.bind(this,path)}>/ {path.name}</span>
        })}
        <div>
        {this.state.files.map((file)=>{
          console.log(file)
          if(file.is_folder){
            return <div onClick={this.openFolder.bind(this,file)}>
              <i className="fa fa-folder" aria-hidden="true"></i>
              {file.name}
            </div>
          } else {
            return <div onClick={this.openFile.bind(this,file)}>
              <i className="fa fa-file" aria-hidden="true"></i>
              <span className={file._id === this.state.highlightedFile ? 'highlightedFile' : null}>{file.name}</span>
            </div>
          }
        })}
          </div>
      </div>
    )
  }
}