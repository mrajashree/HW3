var http      = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis')
var express = require('express')
var app = express()
var client = redis.createClient(6379, '127.0.0.1', {})

client.del('hosts')

client.lpush(['hosts','http://127.0.0.1:3000'],function(err, value) {
	console.log("VALUE : ",value)
})
client.lpush(['hosts','http://127.0.0.1:3001'],function(err, value) {
	console.log("VALUE : ",value)
})

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