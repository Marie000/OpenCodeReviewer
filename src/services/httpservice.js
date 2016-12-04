var baseURL = 'http://localhost:6060';

var service = {
	get: function(url){
		return fetch(baseURL + url)
		.then(function(response){
			var res = response.json();
			console.log("cyrille: " , res);
			return res;
		})
	}
};

export default service;