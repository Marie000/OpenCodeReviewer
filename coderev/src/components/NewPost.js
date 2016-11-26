import React, { Component } from 'react';
import HTTP from '../services/httpservice';


export default class NewPost extends Component {
  constructor() {
    super();
    this.state = { 
    	title: '',
      code: '',
      tags: []
    }
  }

  getState(){
    return this.state;
  }

  static contextTypes= {
    router: React.PropTypes.object.isRequired
  }

  handleChange (input, e) {
    var change = {};
    change[input] = e.target.value;
    this.setState(change);
  }

  handleSubmit(e) {
    e.preventDefault();
    var request = new XMLHttpRequest();

    var data = this.getState();

    console.log('click')
    request.open('POST', 'http://localhost:6060/posts', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('data='+JSON.stringify(data));
    this.context.router.push('/dashboard');
  }


  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit.bind(this)}>
          <label> Title: </label>
          <input type="text" name="title" value={this.state.title} 
                             onChange={this.handleChange.bind(this, 'title')}>
          </input> <br/>
          <label> Your Code: </label>
          <input type="text" name="code" value={this.state.code} 
                             onChange={this.handleChange.bind(this, 'code')}>
          </input><br/>
          <label> Tags: </label>
          <input type="text" name="tags"  value={this.state.tags} 
                             onChange={this.handleChange.bind(this, 'tags')}>
          </input><br/>
          <input type="submit" value="Submit code" ></input>
      </form>

      <p> Here: {this.state.title}, {this.state.code}, {this.state.tags}   </p>
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