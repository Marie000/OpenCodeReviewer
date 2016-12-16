var baseURL = 'http://localhost:8080/api';
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODQ0YTYxZjc3NTJmZjE4ZmM2OTI2NWUiLCJhdXRoIjoiYXV0aCIsImlhdCI6MTQ4MDg5NDAwOH0.wm6KyqjSdDdmNylk8wGZIBTigRltTOk0Xk2zrEjcMJ8'

var service = {
	get: function(url){
		return fetch(baseURL + url)
		.then(function(response){
			var res = response.json();
			return res;
		})
	},
	post: function(url, data){
		console.log('posting');
		var request = new XMLHttpRequest();
    	request.open('POST', baseURL + url, true);
    	request.setRequestHeader('Content-Type', 'application/JSON');
    	request.setRequestHeader('x-auth', token);
    	request.send(JSON.stringify(data));
    	} 
	};

export default service;