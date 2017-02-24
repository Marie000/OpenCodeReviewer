import React, { Component } from 'react';
import axios from 'axios';

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
    axios.post('/api/comments/',data)
      .then(()=>{
        this.props.reload();
        this.setState({text:""})
      });
	}

  render(){
  	return(
      <div>
  		<div className="row">
        <div className='col-md-2 post-title'> {this.props.fileSpecific ? "Comment on this file:" : "Comment on the whole project:"} </div>
        <div className='col-md-10'>  
          <textarea className="input full-width" name="comment" value={this.state.text} onChange={this.handleChange.bind(this)} />     
         </div>
      </div>   
       <button className='button-darkgreen-small link mrgBtm10 pull-right ' onClick={this.handleSubmit.bind(this)} >Submit your comment</button>    
  	 </div>
    )
  }
 }

