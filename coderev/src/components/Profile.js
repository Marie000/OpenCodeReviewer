import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Profile extends Component {
  constructor() {
    super();

  }

  render(){
  	return(
  	<div>
      <li className='menu-link'> <Link className='link' to="/dashboard">Back</Link> </li>
  		<p> Profile here </p>
  	</div>
  	)
  }
}