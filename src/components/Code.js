import React, { Component } from 'react';
import HTTP from '../services/httpservice';

export default class Code extends Component {
  constructor(props) {
    super(props);
    this.state = { 

    }
  }

  componentWillUpdate(nextProps){
  	if (nextProps.submit) {
  		console.log('submit request from parent component Post');
  		this.props.saveCode(this.state.code);
      return
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