// connect to the Microsoft SQL Server instance on Azure VM
var mssql = require('mssql');
var config = {
  user: 'ekgwebapp',
  password: 'ekgsqlserver1MSSS',
  server: 'ekgmsss.cloudapp.net',
  database: 'master',
  options: {
    encrypt: true
  }
};

module.exports = {

  getData: function(req, res, next){
    // the time property in the request body should be an object 
    // that contains three properties: day of week (a number
    // between 1 and 7 with 1 = Monday, 7 = Sunday), hour (a number
    // between 0 and 23), and minute (a number between 0 and 59) 
    var startTime = req.body.time;

    // the username was put onto the re quest by the decode middleware
    var username = req.username;

    // query database for the data for data from that user
    mssql.connect(config, function(err){
      // passes any errors to the error handler
      if (err) next(new Error(err));

      var request = new mssql.Request();
      request.query('select x, y1 as y, y2 from SampleData.dbo.chfdb_chf01_275_processed', function(err, results){
        // passes any errors to the error handler
        if (err) next(new Error(err));
        res.json(results);
      });

    });
  }

};