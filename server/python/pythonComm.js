var zerorpc = require("zerorpc");
var client = new zerorpc.Client();

module.exports = function(io) {

  var dataCycle = io
    //.of('/swift')
    .on('connection', function (socket) {
      console.log('new connection');

      // Listen to Swift
      socket.on('message', function (data, fn) {
        //console.log(typeof data);

        // Send data to demo-client
        socket.broadcast.emit('demo', {"data": data});
        // console.log(data);

        data = JSON.stringify(data);

        // Talk to Python
        client.connect("tcp://127.0.0.1:5000");
        client.on('error', function(error) {
          console.error("RPC Client Error:", error);
        });
        
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

      });
    });
};