import cookie from 'react-cookie';

var baseURL = 'http://localhost:8080/api';
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODQ0YTYxZjc3NTJmZjE4ZmM2OTI2NWUiLCJhdXRoIjoiYXV0aCIsImlhdCI6MTQ4MDg5NDAwOH0.wm6KyqjSdDdmNylk8wGZIBTigRltTOk0Xk2zrEjcMJ8'



var service = {

	get: function(url){
		return fetch(baseURL + url, {
		  method: "GET",
		  headers: {
		    'Content-Type': 'application/json', // This is set on request
		  },
		  credentials: 'include'
		})
		.then(function(response){
			var res = response.json();
			console.log('receiving from server: ', res);
			return res;
		}).catch(function(){
			console.log("error")
		})
	},

	post: function(url, data){
		console.log('sending POST request');
		var request = new XMLHttpRequest();
    	request.open('POST', baseURL + url, true);
    	request.withCredentials = true;
    	request.setRequestHeader('Content-Type', 'application/JSON');
    	request.send(JSON.stringify(data));
    	},

    patch: function(url, data){
		console.log('sending POST request');
		var request = new XMLHttpRequest();
    	request.open('PATCH', baseURL + url, false);
    	request.withCredentials = true;
    	request.setRequestHeader('Content-Type', 'application/JSON');
    	request.send(JSON.stringify(data));
    	},

	delete: function(url, data){
		var request = new XMLHttpRequest();
		request.open('DELETE', baseURL + url, true);
		request.withCredentials = true;
		request.setRequestHeader('Content-Type', 'application/JSON');
		request.send(JSON.stringify(data));
		}
	};
	
export default service;