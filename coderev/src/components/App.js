import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';


class App extends Component {

  constructor() {
    super();

  }

   handleSubmit(){
    var request = new XMLHttpRequest();
    console.log('click')
    request.open('POST', 'http://localhost:6060/animals', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('data=dana');
   } 


  render() {

    return (
      <div className="App">
        <div className="App-header">

          <h2>Welcome to React</h2>
        </div>
        <div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button> <Link to="/dashboard/NewPost">Post a new question</Link>  </button> <br/>
         <Link to="/profile" activeStyle={{ color: 'red' }}>Profile</Link> <br/>
         <Link to="/dashboard" activeStyle={{ color: 'red' }}>Dashboard</Link>
         <p></p>
         <div className = 'child'>
        {this.props.children}
        </div>
        <p></p>      

        <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

export default App;
