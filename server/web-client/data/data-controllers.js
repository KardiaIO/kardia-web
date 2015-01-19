// Connect to Postgres Database on Heroku.
var pg = require('pg').native;
var connString = process.env.POSTGRES_URL;

module.exports = {

  getData: function(req, res, next){
    // This is just testing Postgres connection.  To be used once user data is captured from Swift.
    pg.connect(connString, function(err, client, done) {
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
      });
    });

  }

};
