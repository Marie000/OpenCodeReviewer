import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/python/python';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/go/go';
import 'codemirror/mode/php/php';
import 'codemirror/mode/r/r';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/coffeescript/coffeescript';
import 'codemirror/mode/swift/swift';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import languageList from '../../services/codemirror-languages';
import ReactSelectize from 'react-selectize';
var SimpleSelect =  ReactSelectize.SimpleSelect;



export default class Code extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      code:this.props.code || "// Code \n\n\n\n\n\n\n\n\n\n\n\n\n",
      mode:'text'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (newCode) {
    console.log('newCode: '+newCode)
    this.setState({code: newCode});
    this.props.saveCode(newCode)
  }

  changeMode(e) {
    this.setState({mode:e.target.value});
    this.props.setLanguage(e.target.value);
  }

render() {
    var codemirrorMode="text";
    languageList.forEach((language)=>{
      if(language[0]===this.state.mode){
        codemirrorMode = language[1]
      }
    });

    var options = {
      lineNumbers: true,
      mode: codemirrorMode,
      matchBrackets: true,
      closebrackets: true
    }

    var newLanguageList = []
    languageList.map((language)=>{
      newLanguageList.push({label:language[0],value:language[0]})
    })

    return (
      <div>
        Choose the language mode for the text editor:
        <div>
        <SimpleSelect className='full-width'
                      ref="simpleselect"
                      options={newLanguageList}
                      value={{'label':this.state.mode, 'value':this.state.mode}}
                      onValueChange={(value)=>{
                      this.setState({mode:value.value})
                      this.props.setLanguage(value.value)
                      }}
        />
          </div>
        <br />
        <div className="form-item">
          <CodeMirror className="codemirror-wrapper" value={this.state.code} onChange={this.handleChange} options={options} />
        </div>
        </div>
    	)
	}
}