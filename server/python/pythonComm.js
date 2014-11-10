var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://ekg-python12.cloudapp.net:4242");

// checks whether connection to Python is present
client.invoke("hello", "Node!", function(error, res, more) {
    if(error){
      throw error;
      console.log("Python error:", error);
    }
    console.log("Response from Python:", res);
});

module.exports = client;