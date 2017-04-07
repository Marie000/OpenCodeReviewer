import React, { Component } from 'react';
import { Link } from 'react-router';
import './App.css';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {MenuItem} from 'material-ui';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
//import injectTapEventPlugin from 'react-tap-event-plugin';

export default class Notification extends Component {
    render() {
        return(
            <MenuItem leftIcon={<PersonAdd />}><Link className='notification__link' to={'/userPosts/'}>notification</Link></MenuItem>
            )
    }
}