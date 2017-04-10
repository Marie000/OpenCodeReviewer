import axios from 'axios';
import io from 'socket.io';

var socket = io('http://localhost');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

import config from '../../config';
const api = config.api || 'http://checkmycode.ca';



let username=this.props.route.auth.getProfile().username;

axios.get(api +'/api/users/'+ username +'/reviews')