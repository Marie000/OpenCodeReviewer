import React, { Component } from 'react';
import axios from 'axios';

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
    axios.post('/api/comments/',data)
      .then(()=>{
        this.props.reload();
        this.setState({
          text:""
        })
      });
	}

  render(){
  	return(
      <div>
  		<div className="row">
        <div className='col-md-2 post-title'> Your comment: </div>
        <div className='col-md-10'>  
          <textarea className="input full-width" name="comment" value={this.state.text} onChange={this.handleChange.bind(this)} />     
         </div>
      </div>   
       <button className='button-darkgreen-small link mrgBtm10 pull-right ' onClick={this.handleSubmit.bind(this)} >Submit your comment</button>    
  	 </div>
    )
  }
 }

