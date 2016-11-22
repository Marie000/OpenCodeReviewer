import React, { Component } from 'react';
import HTTP from '../services/httpservice';


export default class NewPost extends Component {
  constructor() {
    super();
    this.state = { 
    	value: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }


  render() {
    return (
      <div>
      <form >
          <label> Title: </label>
          <input type="text" name="title"></input> <br/>
          <label> Your Code: </label>
          <input type="text" name="code"></input><br/>
          <label> Tags: </label>
          <input type="text" name="tags"></input><br/>
          <input type="submit" value="Submit" ></input>

      </form>
      </div>
    )
  }


/*

constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }


  var Hello = React.createClass({
    getInitialState: function() {
        return {input1:0, 
                input2:0};
    },
    render: function() {
      var total = this.state.input1 + this.state.input2;
      return (
        <div>{total}<br/>
          <input type="text" value={this.state.input1} 
                             onChange={this.handleChange.bind(this, 'input1')} />
          <input type="text" value={this.state.input2} 
                             onChange={this.handleChange.bind(this, 'input2')} />
        </div>
      );
    },
    handleChange: function (name, e) {
      var change = {};
      change[name] = e.target.value;
      this.setState(change);
    }
  });

  React.renderComponent(<Hello />, document.getElementById('content'));
*/
}