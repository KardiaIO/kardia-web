var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:5000");
client.on('error', function(error) {
  console.error("RPC Client Error:", error);
});

// checks whether connection to Python is present
client.invoke("hello", "Node!", function(error, res, more) {
    if(error){
      console.error(error);
    }
    console.log("Response from Python:", res);
});

// Sends some data to Python, Python squares it - this is simply part
// of testing the python connection and can be removed later

client.invoke("nodeRequest", function(error, res, more) {
  if(error){
    console.log("THIS IS ERROR", error);
    console.log(error);
  } 
  console.log("PYTHON SEZ:", res);
});

module.exports = client;