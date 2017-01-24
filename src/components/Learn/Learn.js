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
      <div>
      <h1>Learning Resources</h1>
        <h2>How to do a Code Review</h2>
        <strong>Coming Soon!</strong>

        <h2>How to write better code</h2>
        <Link to="/learn/code">Javascript</Link>
        
      </div>
    )
  }
}

