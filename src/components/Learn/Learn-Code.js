import React, { Component } from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import LearnCodeContent from './Learn-Code-Content';


export default class LearnCode extends Component {
  constructor(props) {
    super(props);
    this.state={

    }
  }


  render(){

    return(
      <div>
        <h1>How to write better code</h1>
<ul>
  <li>
        <Link to="/learn/code/1">Variable Names</Link>
</li>
  <li>
        <Link to="/learn/code/2">Comments</Link>
</li>
</ul>
      </div>
    )
  }
}

