import React, { Component } from 'react';
import Moment from 'moment';
import HTTP from '../services/httpservice';
import randomstring from 'randomstring';

/* <button onClick={this.handleSubmit.bind(this)}>Submit comment</button>*/

export default class PostComment extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      postId: this.props.id
    }
  }


  handleChange (e) {
    var comment = e.target.value;
    
    this.setState({
    	text:comment,    	
    });
  }

  handleSubmit(e) {
    //e.preventDefault();

    var id =  randomstring.generate(7);
    var commentObj = {
    	id: id,
    	text: this.state.text,
    	date_submitted:Moment(new Date()).locale('en').format('MMM DD YYYY, HH:mm')
    }
    var data = {
    	id:this.state.postId,
    	comment: commentObj
    }
    console.log(data)

    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:6060/posts', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('data='+JSON.stringify(data));

	}



  render(){
  	return(
  		<div>

          <label> Your comment: </label>
          <input type="text" name="comment" value={this.state.text} 
                             onChange={this.handleChange.bind(this)}>
          </input>  <br/>
         
          <input type="submit" value="Submit" ></input>
         </div>
       
  	)
  }

 }

