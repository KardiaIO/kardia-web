// Handles the errors on the server
module.exports = {
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // Send error message to client
    res.status(500).send({error: error.message});
  }
};