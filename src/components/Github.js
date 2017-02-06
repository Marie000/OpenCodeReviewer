import React, { Component } from 'react';
import $ from 'jquery';
import CodeMirror from 'react-codemirror';
import  ReactSelectize from "react-selectize";
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
   componentWillUpdate(nextProps){
    if (nextProps.submit) {
      this.props.saveCode(this.state.fileContent);
    }
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
      $.get('https://api.github.com/users/' + this.state.user_name + '/repos', (data)=> {
        scope.setState({repos: data, selectedRepo:'', files:[], fileContent:''})
      })
    }
  }

  // not used right now - only getting files from master for now
  getBranches(repo){
    this.setState({stage2:true});
    var scope = this;
    if(this.state.repos) {
      $.get('https://api.github.com/repos/'+this.state.user_name + '/'+ repo+'/branches', (data)=>{
        console.log(data)
        scope.setState({branches: data})
      })
    }
  }

  // get a list of files and folders from the selected repo (right now, branch is set to 'master' and not used)
  getFiles(branch,repo){
    this.setState({stage3:true});
    $.get('https://api.github.com/repos/'+this.state.user_name+'/'+repo+'/contents', (data)=>{
      this.setState({files:data, selectedRepo:repo})
    })
  }

  // get the content of a file
  selectFile(path){
    $.get('https://api.github.com/repos/'+this.state.user_name+'/'+this.state.selectedRepo+'/contents/'+path, (data)=>{
      this.setState({fileContent:atob(data.content), stage4:true})
    })
  }

  // open a folder
  resolvePath(path){
    $.get('https://api.github.com/repos/'+this.state.user_name+'/'+this.state.selectedRepo+'/contents'+path, (data)=>{
      this.setState({files:data})
    })
  }


  render(){
    var scope = this
    //commented out because right now I am only able to get files from the master branch
    // let reposList=this.state.repos.map((repo)=><li key={repo.id}><button onClick={this.getBranches.bind(this,repo.name)}>{repo.name}</button></li>)
    //let branchList=this.state.branches.map((branch)=><li key={branch.name}><button onClick={this.getFiles.bind(this,branch.name)}>{branch.name}</button></li>)

 //   let reposList=this.state.repos.map((repo)=><li key={repo.id}><button onClick={this.getFiles.bind(this,'master',repo.name)}>{repo.name}</button></li>)
    var repoList = this.state.repos.map(function(repo){
      console.log(repo)
        return {label: repo.name, value: repo.name}
    });

    let branchList='';

    let fileList=this.state.files.map((file)=>{

      return file.type==='file' ? <li className='github-file red' onClick={this.selectFile.bind(this,file.path)}>{file.name}</li> :
        <li className='github-folder'><button className='tags' onClick={this.resolvePath.bind(this,file.path)}>{file.name}</button></li>;
    })



    return(
      <div>
        <form className='github'>
          <label> User Name: </label>
          <input  type="text" name="user_name"  value={this.state.user_name}
                 onChange={this.handleChange.bind(this, 'user_name')}>
          </input>
          <button className='button-darkgreen-small inline-blk' type="submit" onClick={this.submitUserName.bind(this)}>OK</button>
        </form>

        {this.state.stage1 ? 
          <div id='simple-select-repos'>
          <button className='button-darkgreen-small inline-blk pull-right ' id="github1-ok" type="submit" onClick={this.getFiles.bind(this,'master', this.state.selectedRepo)}>OK</button>
        <SimpleSelect ref="simpleselect" options={repoList} placeholder = "Select repository"  value={{'label':this.state.selectedRepo, 'value':this.state.selectedRepo}}
        onValueChange = {function(value){
                   scope.setState({selectedRepo: value.value});
        }}></SimpleSelect>
        
          </div>
          : null}

        {/*stage 2 is not used right now.*/}
        {this.state.stage2 ? <ul>{branchList}</ul> : null}

        {this.state.stage3 ? <div><ul>{fileList}</ul><button onClick={this.getFiles.bind(this,'master',this.state.selectedRepo)}>Back to top</button></div> : null}

        {this.state.stage4 ?
        <CodeMirror className="codemirror-wrapper" value={this.state.fileContent}  /> : null}
      </div>
    )
  }
}


