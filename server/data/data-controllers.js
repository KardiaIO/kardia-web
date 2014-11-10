module.exports = {

  getData: function(req, res, next){

    // the time property in the request body should be an object 
    // that contains three properties: day of week (a number
    // between 1 and 7 with 1 = Monday, 7 = Sunday), hour (a number
    // between 0 and 23), and minute (a number between 0 and 59) 
    var startTime = req.body.time;

    // the username was put onto the request by the decode middleware
    var username = req.username;

    // query database for the data for data from that user
    // INSERT CODE TO PING SQL DATABASE HERE


  }
  
};