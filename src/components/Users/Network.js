import React, { Component } from 'react';
import { Link } from 'react-router';
//import UserPosts from './UserPosts';
import {FlatButton,Card} from 'material-ui';
import axios from 'axios';
import './users.css';

import config from '../../../config';

export default class Network extends Component {
  constructor(props) {
    super(props);
    this.state={
        placeholder: "This is a placeholder"
    }
  }
  render() {
    return(
        <div>{this.state.placeholder}</div>
        )
  }
}