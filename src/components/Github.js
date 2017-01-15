import React, { Component } from 'react';
import $ from 'jquery';
import CodeMirror from 'react-codemirror';


export default class Github extends Component {
  constructor() {
    super();
    this.state={
      stage:0,
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
    this.setState({stage:1});
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
        scope.setState({repos: data})
      })
    }
  }

  // not used right now - only getting files from master for now
  getBranches(repo){
    this.setState({stage:2});
    var scope = this;
    if(this.state.repos) {
      $.get('https://api.github.com/repos/'+this.state.user_name + '/'+ repo+'/branches', (data)=>{
        console.log(data)
        scope.setState({branches: data, selectedRepo:repo})
      })
    }
  }

  // get a list of files and folders from the selected repo (right now, branch is set to 'master' and not used)
  getFiles(branch,repo){
    this.setState({stage:3});
    $.get('https://api.github.com/repos/'+this.state.user_name+'/'+repo+'/contents', (data)=>{
      this.setState({files:data, selectedRepo:repo})
    })
  }

  // get the content of a file
  selectFile(path){
    $.get('https://api.github.com/repos/'+this.state.user_name+'/'+this.state.selectedRepo+'/contents/'+path, (data)=>{
      this.setState({fileContent:data.content, stage:4})
    })
  }

  // open a folder
  resolvePath(path){
    $.get('https://api.github.com/repos/'+this.state.user_name+'/'+this.state.selectedRepo+'/contents'+path, (data)=>{
      this.setState({files:data})
    })
  }


  render(){
    //commented out because right now I am only able to get files from the master branch
    // let reposList=this.state.repos.map((repo)=><li key={repo.id}><button onClick={this.getBranches.bind(this,repo.name)}>{repo.name}</button></li>)
    //let branchList=this.state.branches.map((branch)=><li key={branch.name}><button onClick={this.getFiles.bind(this,branch.name)}>{branch.name}</button></li>)

    let reposList=this.state.repos.map((repo)=><li key={repo.id}><button onClick={this.getFiles.bind(this,'master',repo.name)}>{repo.name}</button></li>)
    let branchList='';

    let fileList=this.state.files.map((file)=>{

      return file.type==='file' ? <li onClick={this.selectFile.bind(this,file.path)}>File: {file.name}</li> :
        <li><button onClick={this.resolvePath.bind(this,file.path)}>{file.name}</button></li>;
    })



    return(
      <div>
        <form>
          <label> User Name: </label>
          <input type="text" name="user_name"  value={this.state.user_name}
                 onChange={this.handleChange.bind(this, 'user_name')}>
          </input>
          <input type="submit" onClick={this.submitUserName.bind(this)} />
        </form>

        {this.state.stage===1 ? <ul>{reposList}</ul> : null}

        {/*stage 2 is not used right now.*/}
        {this.state.stage===2 ? <ul>{branchList}</ul> : null}

        {this.state.stage===3 ? <div><button onClick={this.getFiles.bind(this,'master',this.state.selectedRepo)}>Back to top</button><ul>{fileList}</ul></div> : null}

        {this.state.stage===4 ?
        <CodeMirror value={atob(this.state.fileContent)}  /> : null}
      </div>
    )
  }
}
