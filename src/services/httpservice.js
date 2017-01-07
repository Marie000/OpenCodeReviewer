import cookie from 'react-cookie';

var baseURL = 'http://localhost:8080/api';
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODQ0YTYxZjc3NTJmZjE4ZmM2OTI2NWUiLCJhdXRoIjoiYXV0aCIsImlhdCI6MTQ4MDg5NDAwOH0.wm6KyqjSdDdmNylk8wGZIBTigRltTOk0Xk2zrEjcMJ8'



var service = {
	get: function(url){
//		return fetch(baseURL + url, {headers: {'x-auth': token}})
		return fetch(baseURL + url, {
		  method: "GET",
		  headers: {
		    'Content-Type': 'application/json', // This is set on request
		    'credentials': 'include'
		  }
		})
//		return fetch(baseURL + url)
		.then(function(response){
			var res = response.json();
			console.log('receiving from server: ', res);
			return res;
		})
	},
	post: function(url, data){
		console.log('sending POST request');
		var request = new XMLHttpRequest();
    	request.open('POST', baseURL + url, true);
    	request.withCredentials = true;
    	request.setRequestHeader('Content-Type', 'application/JSON');
    	
    //	request.setRequestHeader('x-auth', cookie.load('token'));
    	request.send(JSON.stringify(data));
/*
    	request.onload = function () {
    // do something to response
    		var res = this.responseText;
    		console.log('res: ',res);
		};
*/
    	},

    patch: function(url, data){
		console.log('sending POST request');
		var request = new XMLHttpRequest();
    	request.open('PATCH', baseURL + url, false);
    	request.withCredentials = true;
    	request.setRequestHeader('Content-Type', 'application/JSON');
   // 	request.setRequestHeader('x-auth', token);
    	request.send(JSON.stringify(data));
    	}  
	};

export default service;