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
    // The time property in the request body should be an object 
    // that contains three properties: 
    //     1) day of week (0-6, Sunday-Monday)
    //     2) hour (0-23)
    //     3) minute (0-59)
    var requestedTime = req.body.time;
/*    
    var year = (new Date()).getFullYear();
    var month = (new Date()).getMonth();
    var utc = Date.UTC(year, month, requestedTime.date, requestedTime.hour, requestedTime.minute);*/

    // The time property in the request body should be a number
    // that indicates the UTC ms time
    var startTime = req.body.time;
    startTime -= 1420000000000;

    /**************************************************************************/
    /* TODO: Get request with json data in certain range ( 1 minute )
    /**************************************************************************/

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
        if (err) next(new Error('Error in query' + err));
        res.json(results.map(function(item){
            return {
              x: item.x + 1420000000000,
              y: item.y,
              indicator: item.maxIndicator
            };
        }));
      });

    });
  }

};
