// Connect to Postgres Database on Heroku.
var pg = require('pg').native;
var conString = process.env.POSTGRES_URL;
// var io = require('../../../server.js').io;

module.exports = {

  getData: function(req, res, next){
    // The time property in the request body should be a number
    // that indicates the UTC ms time
    //var startTime = req.body.time;
    //startTime -= 1420000000000;

    // The username was put onto the request by the decode middleware
    //var username = req.username;

    // Query database for the data from that user
    // mssql.connect(config, function(err){
    //   // Passes any errors to the error handler
    //   if (err) next(new Error('connection error ' + err));

    //   var request = new mssql.Request();
    //   request.query('select * from SampleData.dbo.sampleEKG' + 
    //     ' where x >= ' + startTime + ' and x < ' + (parseInt(startTime) + 200000) +
    //     ' and (x % 16 = 0 or maxIndicator = 1)', 
    //     function(err, results){
    //     // Passes any errors to the error handler
    //     if (err) next(new Error('Error in query ' + err));
    //     res.json(results.map(function(item){
    //       return {
    //         x: item.x + 1420000000000,
    //         y: item.y,
    //         indicator: item.maxIndicator
    //       };
    //     }));
    //   });
    //});

    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT * FROM users', function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        
        console.log(result);
        // res.send(result);
        //output: 1
      });
    });

  // export from server {time: iso-timestamp, amplitude: data-point} 
  // var dataArr = [];
  // var dataRes = [];

  // io
  // .of('/swift')
  // .on("connection", function (socket){
  //   console.log("data controller");
  //   socket.on('message', function (data) {
  //     console.log(data);
  //     dataArr.push(data);
  //   });
  // });

  // for (var i = 0; i < dataArr.length; i++) {
  //   var newData = {};
  //   newData.x = dataArr[i].time;
  //   newData.y = dataArr[i].amplitude;
  //   newData.indicator = dataArr[i].amplitude;

  //   dataRes.push(newData);
  // }
  
  // res.send(dataRes);

  },

  getAnalysisResults: function(req, res, next){

    var username = req.username;
    var startTime = req.body.time;
    startTime -= 1420000000000;

    // mssql.connect(config, function(err){
    //   var request = new mssql.Request();
    //   request.query('select top 24 interval from SampleData.dbo.SamplePeakIntervals' +
    //     ' where x > ' + startTime +
    //     ' order by x', function(err, results){
    //     if (err) next(new Error('Error in query ' + err));
    //     var row = 0;
    //     res.json(results.map(function(item){
    //       row++;
    //       return {
    //         x: row,
    //         y: item.interval
    //       };
    //     }));
    //   });
    // });

  },

  getLorenzResults: function(req, res, next){

    var username = req.username;
    var startTime = req.body.time;
    startTime -= 1420000000000;

    // mssql.connect(config, function(err){
    //   var request = new mssql.Request();
    //   request.query('select distinct top 15 a.interval as x, b.interval as y' +
    //     ' from' +
    //     '   (' +
    //     '   select ROW_NUMBER() OVER (ORDER BY X) as row, * ' +
    //     '   from SampleData.dbo.SamplePeakIntervals' +
    //     '   where x > ' + startTime +
    //     '   ) a' +
    //     ' join ' +
    //     '   (' +
    //     '   select ROW_NUMBER() OVER (ORDER BY X) as row, * ' +
    //     '   from SampleData.dbo.SamplePeakIntervals' +
    //     '   ) b' +
    //     '   on a.row = b.row - 1' +
    //     ' order by 1', function(err, results){
    //     if (err) next(new Error('Error in query ' + err));
    //     res.json(results);
    //   });
    // });

  }

};
