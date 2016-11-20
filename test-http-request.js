http = require('http');
opts = require('url').parse('http://localhost:8172');
req = http.request(opts, res => {
	console.log(res.headers);
	res.on('data', data => console.log(data.toString()));
	res.on('end', ()=>console.log('end'));
}).end();
