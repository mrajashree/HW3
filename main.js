var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
var images = [];
app.use(function(req, res, next) 
{
	client.lpush(['recent_sites',req.url], function(err,reply) {
		//console.log(reply);
		})

	client.ltrim('recent_sites',0,4,function(err,reply) {
		//console.log(reply);
	})

	next(); // Passing the request to the next handler in the stack.
});


app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   console.log(req.body) // form fields
   console.log("REQ FILES : ",req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		client.rpush(['images',img], function(err,reply) {
	  			console.log("REPLY : ",reply);
	  		})
	  	});
	}

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {
	client.lpop('images',function(err,imagedata) 
	{
		if (err) throw err;
		res.writeHead(200, {'content-type':'text/html'});
		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>"+"<br>from host : "+req.client.server._connectionKey.slice(7,11));
   		res.end();
	})
})

 var server = app.listen(process.argv[2], function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

app.get('/', function(req, res) {
  res.send('hello user!<br> from host : '+req.client.server._connectionKey.slice(7,11))
})

app.get('/set',function(req,res) {
	client.set("new_key","this message will self-destruct in 10 seconds",function(err,value) {
		res.send(value);
	})
	client.expire("new_key",10);
})

app.get('/get',function(req,res) {
	client.get("new_key", function(err,value) { 
		if(value)
			res.send("message : "+value+"<br>from host : "+req.client.server._connectionKey.slice(7,11))
		else
			res.send('Message expired!')
	});
})

app.get('/recent',function(req,res) {
	client.lrange('recent_sites',0,4,function(err,value) {
		res.send(value+"<br>from host : "+req.client.server._connectionKey.slice(7,11));
	})
})
