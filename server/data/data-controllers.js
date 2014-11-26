// Connect to the Microsoft SQL Server instance on Azure VM
var mssql = require('mssql');
var config = {
  user: 'ekgwebapp',
  password: 'ekgsqlserver1MSSS',
  server: 'ekgsql.cloudapp.net',
  database: 'SampleData',
  options: {
    encrypt: true
  }
};

module.exports = {

  getData: function(req, res, next){
    // The time property in the request body should be a number
    // that indicates the UTC ms time
    var startTime = req.body.time;
    startTime -= 1420000000000;

    // The username was put onto the request by the decode middleware
    var username = req.username;

    // Query database for the data from that user
    mssql.connect(config, function(err){
      // Passes any errors to the error handler
      if (err) next(new Error('connection error ' + err));

      var request = new mssql.Request();
      request.query('select * from SampleData.dbo.sampleEKG'
        + ' where x >= ' + startTime + ' and x < ' + (parseInt(startTime) + 200000)
        + ' and (x % 16 = 0 or maxIndicator = 1)', 
        function(err, results){
        // Passes any errors to the error handler
        if (err) next(new Error('Error in query ' + err));
        res.json(results.map(function(item){
          return {
            x: item.x + 1420000000000,
            y: item.y,
            indicator: item.maxIndicator
          };
        }));
      });

    });
  },

  getAnalysisResults: function(req, res, next){

    var username = req.username;
    var startTime = req.body.time;
    startTime -= 1420000000000;

    mssql.connect(config, function(err){
      var request = new mssql.Request();
      request.query('select top 24 interval from SampleData.dbo.SamplePeakIntervals'
        + ' where x > ' + startTime
        + ' order by x', function(err, results){
        if (err) next(new Error('Error in query ' + err));
        var row = 0;
        res.json(results.map(function(item){
          row++;
          return {
            x: row,
            y: item.interval
          };
        }));
      });
    });

  }

};
