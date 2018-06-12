var express    = require('express');
var fileUpload = require('express-fileupload');
var fs         = require('fs');
var app        = express();
// view
app.set('views', __dirname + '/view');//模板目录
app.set('view engine', 'ejs'); //模板语法设置成ejs
app.engine('ejs', require('ejs').__express);//

// file
app.use(fileUpload());
// 静态资源
app.use(express.static('upload-file'));

var resData = {
	status: 1,
	data: 'Hi, this is uncle-yang.'
}

/**
 * 配置cros
 * 需要路由声明之前执行
 */  
app.all('*', function(req, res, next) {
	//来访的域名
	let origin   = req.headers.origin;
	// 允许访问的白名单
	let whitelist = [
		'http://dev.test.com',
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

// set router
app.get('/', function(req, res){
	res.send('Hello World!');
});

// 正常请求
app.get('/get-name', function(req, res){
	res.json(resData);
});

// jsonp
app.get('/jsonp', function(req, res){
	res.jsonp(resData);
});

// 通过iframe+postMessage的请求
app.get('/iframe-postMessage', function(req, res){
	res.render('post-message');
});

// 正常请求
app.post('/upload-image', function(req, res){
	let data = {
		status: 0,
		mes: "没有获取到文件",
	}

	if(!req.files){
		res.json(data);

		return;
	}

	// 获取到上传的文件
	let image = req.files.image;

	// 把文件存到本地
	image.mv(`./upload-file/${image.name}`, function(){

		res.json({
			status: 1,
			data: `http://dev.example.com/${image.name}`,
		})

	});

});

// start server
var server = app.listen(3500, function(){
	var host = server.address().address;
  	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
})