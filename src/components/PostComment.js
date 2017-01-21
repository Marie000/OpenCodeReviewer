import React, { Component } from 'react';
import HTTP from '../services/httpservice';

export default class PostComment extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      "_document_id": this.props.id,
      "is_general":"true",
      "position":null,
      text:""
    }
  }

  handleChange (e) {
    var comment = e.target.value;   
    this.setState({
    	text:comment,    	
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var data = this.state;
    HTTP.post('/comments/', data);

    window.setTimeout(function () {  
       this.props.reload();
       this.setState({
          text:""
       })
    }.bind(this), 800); 
	}

  render(){
  	return(
  		<div className="clearfix">
          <label className="post-title"> Your comment: </label>
          <textarea className="" name="comment" value={this.state.text} onChange={this.handleChange.bind(this)} />     
          <button className='button-darkgreen link mrgBtm10 pull-right ' onClick={this.handleSubmit.bind(this)} >Submit your comment</button>
         </div>       
  	)
  }
 }

