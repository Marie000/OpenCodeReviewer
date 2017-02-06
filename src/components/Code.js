import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';


export default class Code extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      code:"// Code \n\n\n\n\n\n\n\n\n\n\n\n\n"
    };
    this.handleChange = this.handleChange.bind(this);
  }


  componentWillUpdate(nextProps){
  	if (nextProps.submit) {
  		this.props.saveCode(this.state.code);
  	}
  }

  handleChange (newCode) {
    this.setState({code: newCode});
  }

render() {

    var options = {
      lineNumbers: true,
      mode: 'javascript',
      matchBrackets: true,
      closebrackets: true

    }

    return (
    		<div className='form-item'>
           <CodeMirror className="codemirror-wrapper" value={this.state.code} onChange={this.handleChange} options={options} />
        </div>
    	)
	}
}