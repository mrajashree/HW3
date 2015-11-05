var http      = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis')
var express = require('express')
var app = express()
var spawn = require('child_process').spawn;
var client = redis.createClient(6379, '127.0.0.1', {})

ports = ['3000','3001'];
client.del('hosts')

for(i in ports)
{
	console.log('http://127.0.0.1:'+ports[i])
	client.lpush(['hosts','http://127.0.0.1:'+ports[i]],function(err, value) {
		console.log("VALUE : ",value)
	})
}

var childs = [];

for(i in ports)
{
	child = spawn('node',['main.js',ports[i]])
	childs.push(child)
}

var options = {};
var proxy   = httpProxy.createProxyServer(options);

var server  = http.createServer(function(req, res)
{
	client.rpoplpush('hosts','hosts',function(err,value) {
		proxy.web( req, res, {target: value } );
		console.log("VALUE rpoplpush: ",value)
	})
});
server.listen(8080);

function kill_all()
{
	for(i in childs)
	{
		childs[i].kill('SIGHUP')
	}
	process.exit();
}

process.on('exit', function(){kill_all();} );
process.on('SIGINT', function(){kill_all();} );
process.on('uncaughtException', function(err){
  console.error(err);
  kill_all();} );
