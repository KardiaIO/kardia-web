var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://ekg-python12.cloudapp.net:4242");

// checks whether connection to Python is present
client.invoke("hello", "Node!", function(error, res, more) {
    if(error){
      throw error;
    }
    console.log("Response from Python:", res);
});

// Sends some data to Python, Python squares it - this is simply part
// of testing the python connection and can be removed later

client.invoke("processData", [1,2,3], function(error, res, more) {
  if(error){
    throw error;
  } 
  console.log(res);
});

module.exports = client;