import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {MenuItem} from 'material-ui';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
//import injectTapEventPlugin from 'react-tap-event-plugin';

export default class Notification extends Component {
    constructor(props) {
    super(props);
    this.state={
        username: '',
        commenter: '',
        comment: ''
    }
  }

    render() {
        return(
            <MenuItem leftIcon={<PersonAdd />}><Link className='notification__link' to={'/userPosts/' + this.props.username}> {this.props.commenter} commented on your post</Link></MenuItem>
            )
    }
}