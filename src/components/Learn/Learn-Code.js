import React, { Component } from 'react';
import { Link } from 'react-router';


export default class LearnCode extends Component {
  constructor(props) {
    super(props);
    this.state={

    }
  }


  render(){

    return(
      <div className="learn-code">
        <h1>How to write better code</h1>

        <Link to="/learn/code/1"><button className="start-button">Start</button></Link>
          <p>
            <Link to="/learn/code/1">Variable Names</Link>
          </p>
          <p>
            <Link to="/learn/code/2">Comments</Link>
          </p>
      </div>
    )
  }
}

