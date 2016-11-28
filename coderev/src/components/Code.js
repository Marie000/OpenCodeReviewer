import React, { Component } from 'react';
import HTTP from '../services/httpservice';

export default class Code extends Component {
  constructor() {
    super();
    this.state = { 
    	id: '',
    	code: ''
    }
  }

  sendData(id){
  	var request = new XMLHttpRequest();
  	var data = this.state;
  	data.id = id;
  	request.open('POST', 'http://localhost:6060/posts', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('data='+JSON.stringify(data));
 //   this.context.router.push('/dashboard');
  }

  componentWillUpdate(nextProps){
  	if (nextProps.submit) {

  		console.log('ok')
  		this.sendData(nextProps.id);
  	}
  }

  handleChange (e) {
    var code = e.target.value;
    this.setState({code: code});
  }

render() {
    return (
    		<div>
          <label> Code: </label>
          <input type="text" name="code" value={this.state.code} 
                             onChange={this.handleChange.bind(this)}>
           </input>
           </div>
    	)
	}
}