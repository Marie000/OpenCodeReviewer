import cookie from 'react-cookie';

var baseURL = '/api';


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
			return res;
		}).catch(function(){
			console.log("error")
		})
	},

	post: function(url, data){
		var request = new XMLHttpRequest();
    	request.open('POST', baseURL + url, true);
    	request.withCredentials = true;
    	request.setRequestHeader('Content-Type', 'application/JSON');
    	request.send(JSON.stringify(data));
    	},

    patch: function(url, data){
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