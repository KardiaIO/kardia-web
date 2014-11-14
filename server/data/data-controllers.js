// Connect to the Microsoft SQL Server instance on Azure VM
var mssql = require('mssql');
var config = {
  user: 'ekgwebapp',
  password: 'ekgsqlserver1MSSS',
  server: '104.40.3.154',
  database: 'master',
  options: {
    encrypt: true
  }
};

module.exports = {

  getData: function(req, res, next){
    // The time property in the request body should be an object 
    // that contains three properties: 
    //     1) day of week (0-6, Sunday-Monday)
    //     2) hour (0-23)
    //     3) minute (0-59)

    var startTime = req.body.time;

    var year = (new Date()).getFullYear();
    var month = (new Date()).getMonth();
    var utc = new Date(year, month, req.body.time.dayOfWeek, req.body.time.hour, req.body.time.minute);
    // Fake data - just to make something appear on screen:
    // var utc = new Date(year, month, 2, 15, 3);

    /**************************************************************************/
    /* Get request with json data in certain range ( 1 minute )
    /**************************************************************************/

    // The username was put onto the request by the decode middleware
    var username = req.username;

    // Query database for the data from that user
    mssql.connect(config, function(err){
      // Passes any errors to the error handler
      if (err) next(new Error(err));

      var request = new mssql.Request();
      request.query('select x, y from SampleData.dbo.processedSampleEKG1', function(err, results){
        // Passes any errors to the error handler
        if (err) next(new Error('Error in first query' + err));
        request.query('select x, maxIndicator as y from SampleData.dbo.processedSampleEKG1', function(err, indicators){
          res.json({
            results: results,
            indicators: indicators
          });
        })
      });

    });
  }

};