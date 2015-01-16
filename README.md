webAppEKGAPI
============
[![Stories in Ready](https://badge.waffle.io/ekgapi/webappekgapi.png?label=ready&title=Ready)](https://waffle.io/ekgapi/webappekgapi) [![Build Status](https://travis-ci.org/EKGAPI/webAppEKGAPI.svg?branch=master)](https://travis-ci.org/EKGAPI/webAppEKGAPI)
===========

Check out our site [Kardia](http://kardia.io/)!

<!-- To view our commented code, please click [here](http://www.explainjs.com/explain?src=https%3A%2F%2Fraw.githubusercontent.com%2FEKGAPI%2FwebAppEKGAPI%2Fmaster%2Fdist%2FnewConcat.js)! -->

App Architecture
============
![alt text](http://res.cloudinary.com/kardia-io/image/upload/v1421366596/Screen_Shot_2015-01-15_at_4_02_38_PM_d3unqx.png "App Architecture")

Server
============
###3Scale
3Scale is third-party API management and authentication. 

### Require and link your 3scale account to the node server.
```javascript
var threeScale = require('3scale').Client;

var threeScaleClient = new threeScale(process.env.THREE_SCALE_CLIENT);
threeScaleClient.authrep({"app_id": process.env.THREE_SCALE_APP_ID, "app_key": process.env.THREE_SCALE_APP_KEY, "usage": { "hits": 1 } }, function(response){
  sys.log(sys.inspect(response));
});
```
To add authentication, more work will be necessary. You can read this blog [post](http://http://davidkae.azurewebsites.net/adding-3scale-to-your-node-js-server-2/) to learn how to do so.

### Web Sockets: Require Socket.io and our built out Socket Functionality
```javascript
var io = require('socket.io')(server);

require('./server/python/pythonComm.js')(io);
```

### Socket.on() && Socket.emit()
In the pythonComm.js file. Whenever our Swift app emits the event 'message', the node.js server will listen for any event called 'message' using socket.on().
```javascript
socket.on('message')
```
The server can then relay the data to our web app with its own emit labeled '/analysisChart'.
```javascript
socket.broadcast.emit('/analysisChart', { "data": data });
```

### Client.invoke()
While listening to the event 'message', node will call the python server's own functions using zeromq/zerorpc's native 'invoke'.
```javascript
client.invoke("functionName", data, function(error, result, more){
  if (error) {
    console.log('error');
  }
  console.log('data is whatever info you want to send to the python server')
  console.log('result is whatever the python server returns');
});
```

### Socket.emit('crunch');
When the invoking our created python function called 'crunch', the python server will send back an analysis of the data it received, which will be emitted in an event called '/node.js'. Anything listening 'on' these emits will receive the result of the 'emit'.
```javascript
socket.emit('/node.js', result); //emit to swift app

socket.broadcast.emit('/node.js', result); //emit to webapp and anything else listening
```









Client
============