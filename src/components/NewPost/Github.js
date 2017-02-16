import React, { Component } from 'react';
import $ from 'jquery';
import CodeMirror from 'react-codemirror';
import  ReactSelectize from "react-selectize";
import axios from 'axios';
var SimpleSelect =  ReactSelectize.SimpleSelect;

export default class Github extends Component {
  constructor(props) {
    super(props);
    this.state={
      stage1:false,
      stage2:false,
      stage3: false,
      stage4: false,
      user_name:'',
      selectedRepo:'',
      repos:[],
      branches:[], // not used right now
      files:[],
      fileContent:''

    }
  }

  // for the username input only
  handleChange (input, e) {
    var change = {};
    change[input] = e.target.value;
    this.setState(change);
  }

  submitUserName(e){
    e.preventDefault();
    this.setState({stage1:true});
    this.getRepos()
  }

  componentWillMount(){
    // this can stay if we want to pass in the github username as a props. Right now it does nothing.
    this.getRepos()
  }

  // get repos from user name entered (or the username could also be passed down as props
  // if the user has it set in his user info)
  getRepos(){
    var scope = this;
    if(this.state.user_name) {
      axios.get('https://api.github.com/users/' + this.state.user_name + '/repos')
        .then((res)=> {
        scope.setState({repos: res.data, selectedRepo:'', files:[], fileContent:'', stage3:false, stage4:false})
      })
    }
  }

  // not used right now - only getting files from master for now
  getBranches(repo){
    this.setState({stage2:true});
    var scope = this;
    if(this.state.repos) {
      axios.get('https://api.github.com/repos/'+this.state.user_name + '/'+ repo+'/branches')
        .then((res)=>{
           scope.setState({branches: res.data})
        })
    }
  }

  // get a list of files and folders from the selected repo (right now, branch is set to 'master' and not used)
  getFiles(branch,repo){
    this.setState({stage3:true});
    axios.get('https://api.github.com/repos/'+this.state.user_name+'/'+repo+'/contents')
      .then((res)=>{
        this.setState({files:res.data, selectedRepo:repo})
      })
  }

  // get the content of a file
  selectFile(path){
    axios.get('https://api.github.com/repos/'+this.state.user_name+'/'+this.state.selectedRepo+'/contents/'+path)
      .then((res)=>{
        this.setState({fileContent:atob(res.data.content), stage4:true})
        this.props.saveCode(atob(res.data.content));

      })
  }

  // open a folder
  resolvePath(path){
    axios.get('https://api.github.com/repos/'+this.state.user_name+'/'+this.state.selectedRepo+'/contents'+path)
      .then((res)=>{
        this.setState({files:res.data})
      })
  }


  render(){
    var scope = this
    //commented out because right now I am only able to get files from the master branch
    // let reposList=this.state.repos.map((repo)=><li key={repo.id}><button onClick={this.getBranches.bind(this,repo.name)}>{repo.name}</button></li>)
    //let branchList=this.state.branches.map((branch)=><li key={branch.name}><button onClick={this.getFiles.bind(this,branch.name)}>{branch.name}</button></li>)

 //   let reposList=this.state.repos.map((repo)=><li key={repo.id}><button onClick={this.getFiles.bind(this,'master',repo.name)}>{repo.name}</button></li>)
    var repoList = this.state.repos.map(function(repo){
        return {label: repo.name, value: repo.name}
    });

    let branchList='';

    let fileList=this.state.files.map((file)=>{
      return file.type==='file' ? <li className='github-file red pull-right' onClick={this.selectFile.bind(this,file.path)}>{file.name}</li> :
        <li className='github-folder pull-left' onClick={this.resolvePath.bind(this,file.path)}>{file.name}</li>;
    })

  var options = {
      lineNumbers: true,
      mode: 'javascript',
      readOnly: false
    }


    return(
      <div className='github-container'>
      <div className='mrgBtm20 mrgTop20'> Import code from a GitHub Repository </div>
      <div className="row">
        <form className='github'>
          <label className='col-md-2'> GitHub User Name: </label>
          <div className='col-md-6'>
            <input className='full-width' type="text" name="user_name"  value={this.state.user_name}
                   onChange={this.handleChange.bind(this, 'user_name')}>
            </input>
          </div>
          <div className='col-md-1'>  
            <button className='button-darkgreen-small inline-blk' type="submit" onClick={this.submitUserName.bind(this)}>OK</button>
          </div>
        </form>
      </div>

      {this.state.stage1 ? 
        <div className='row'>
          <label className='col-md-2'> Repository: </label>
          <div className='col-md-6'>
            <SimpleSelect className='full-width' ref="simpleselect" options={repoList} value={{'label':this.state.selectedRepo, 'value':this.state.selectedRepo}}
            onValueChange = {function(value){
                       scope.setState({selectedRepo: value.value});
            }}></SimpleSelect>
           </div> 
          <div className='col-md-1'>
            <button className='button-darkgreen-small inline-blk' id="github1-ok" type="submit" onClick={this.getFiles.bind(this,'master', this.state.selectedRepo)}>OK</button>
          </div>
        </div>
      : null}

        {/*stage 2 is not used right now.*/}
        {this.state.stage2 ? <ul>{branchList}</ul> : null}

        {this.state.stage3 ? 
        <div>
        <div className='row'>
          <div className='col-md-6 col-md-offset-2 no-padding'>
            <strong className='pull-left mrgBtm10'> Folders: </strong>
            <strong className='pull-right mrgBtm10'> Files: </strong>
            <ul>{fileList}</ul>
          </div> 
        </div>

        <div className='row'> 
          <div className='col-md-offset-2 col-md-2'>
            <button onClick={this.getFiles.bind(this,'master',this.state.selectedRepo)}>Back to top</button>
          </div>
        </div>
        </div>
        : null}

        {this.state.stage4 ?
        <CodeMirror className="codemirror-wrapper" value={this.state.fileContent} options={options}/> : null}
      </div>
    )
  }
}


