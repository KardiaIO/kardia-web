var zerorpc = require("zerorpc");
var client = new zerorpc.Client();
var pythonPortURL = process.env.PYTHON_PORT_URL || 'tcp://127.0.0.1:8000';

module.exports = function(io) {

  var dataCycle = io
    
    .on('connection', function (socket) {
      console.log('new connection');
      //console.log(socket);
        
      // Talk to Python
      client.connect(pythonPortURL);
      client.on('error', function(error) {
        console.error("RPC Client Error:", error);
      });

      // Listen to Swift
      socket.on('message', function (data, fn) {

        data = JSON.stringify(data);
        
        // Checks whether connection to Python is present
        client.invoke("hello", "Node!", function(error, res, more) {
            if(error){
              console.error(error);
            }
            console.log("Response from Python:", res);
        });

        client.invoke("crunch", data, function(error, result, more) {
          if(error) {
            console.log(error);
          }
          // Sends Response from Python to Swift
          console.log('RESULT FROM PYTHON ', result);
          socket.broadcast.emit('node.js', {
            "statusCode": result
          });

          if(!more) {
            console.log("DONE");
          }
        });

        // Send data to demo-client
        socket.broadcast.emit('demo', { "data": data });

      });
    });
};