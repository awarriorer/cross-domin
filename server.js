var express = require('express');
var app     = express();

var resData = {
	status: 1,
	data: 'Hi, this is uncle-yang.'
}

// set router
app.get('/', function(req, res){
	res.send('Hello World!');
});

app.get('/jsonp', function(req, res){
	res.jsonp(resData);
});


// 配置cros
app.all('/get-name', function(req, res, next) {
	//来访的域名
	let origin   = req.headers.origin;
	// 允许访问的白名单
	let whitelist = [
		'http://dev.test.com',
		'http://dev.test2.com',
		'http://dev.test3.com',
	];

	// 判断是否在名单内
	if(whitelist.indexOf(origin) > -1){
		res.header('Access-Control-Allow-Origin', origin);  
	    res.header('Access-Control-Allow-Headers', 'X-Requested-With');  
	    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');  
	    res.header('Content-Type', 'application/json;charset=utf-8');  		    
	}
	// 隐藏当前用的那种框架
	res.header('X-Powered-By','none')  

	next();
});

app.get('/get-name', function(req, res){
	res.json(resData);
});

app.put('/get-name', function(req, res){
	res.json(resData);
});

// start server
var server = app.listen(3500, function(){
	var host = server.address().address;
  	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
})