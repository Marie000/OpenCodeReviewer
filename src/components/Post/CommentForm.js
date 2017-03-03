import React, { Component } from 'react';
import axios from 'axios';

import config from '../../../config';
const api = config.api || '';

export default class PostComment extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      _document_id: this.props.fileSpecific ? null : this.props.id,
      _file_id: this.props.fileSpecific ? this.props.id : null,
      is_general:true,
      position:null,
      text:""
    }
  }

  handleChange (e) {
    console.log(this.state.text)
    this.setState({text:e.target.value});
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      _document_id: nextProps.fileSpecific ? null : nextProps.id,
      _file_id: nextProps.fileSpecific ? nextProps.id : null
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    var data = this.state;
    console.log('this is data: ')
    console.log(data)
    axios.post(api+'/api/comments/',data, {headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then(()=>{
        this.props.reload();
        this.setState({text:""})
      });
	}

  render(){
  	return(
      <div>

        <div className='post-title'> {this.props.fileSpecific ? "Comment on this file:" : "Comment on the whole project:"} </div>
        <form>
          <textarea className="input full-width" name="comment" value={this.state.text} onChange={this.handleChange.bind(this)} />
       <button className='button-darkgreen-small link mrgBtm10 pull-right ' onClick={this.handleSubmit.bind(this)} >Submit your comment</button>
  	  </form>
      </div>
    )
  }
 }

