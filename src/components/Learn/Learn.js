import React, { Component } from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';


export default class Learn extends Component {
  constructor(props) {
    super(props);
    this.state={

    }
  }


  render(){

    return(
      <div className="learn">
      <h1>Learning Resources</h1>
        <div className="learn-section">
          <h2>How to do a Code Review</h2>
          <p>Coming Soon!</p>
        </div>
        <div className="learn-section">
          <h2>How to write better code</h2>
          <p><Link to="/learn/code">Javascript</Link></p>
        </div>
      </div>
    )
  }
}

