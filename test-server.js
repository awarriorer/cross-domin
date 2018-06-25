var express = require('express');
var request = require('request');
var app     = express();

// 静态资源
app.use(express.static('public'));

// 代理
app.get('/server-proxy-api/*',function(req, res){
	
	/**
	 * 这里可以做一些认证的处理，从而完成一些认证
	 */

	//若是http://dev.example.com检查了请求来源，可以把来源设置成和目标一样的地址
	req.headers["referer"] = "http://dev.example.com";

	// 要请求的目标地址
	var url = 'http://dev.example.com' + req.url;

	// 和前端约定好的路径规则，删除标识，恢复真实请求路径
	url = url.replace('/server-proxy-api', '');

	// 开始请求
	var proxy = request[req.method.toLowerCase()](url);
	
	// 响应到页面
	req.pipe(proxy).pipe(res);

});

// start server
var server = app.listen(5678, function(){
	var host = server.address().address;
  	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
})