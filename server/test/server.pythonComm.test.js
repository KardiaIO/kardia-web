/*jshint expr: true*/

var chai = require('chai'),
    mocha = require('mocha'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect;
    chai.should();
    chai.use(sinonChai);

var io = require('socket.io-client');

/**
 * Tests all but broadcast events.  Broadcast emits to all clients except the one that invoked it.  We
 * need to invoke them here as a client.
 */

describe('Socket Communication', function() {
  var socket,
      socket2,
      socket3,
      rpcMockServer,
      spy,
      options = {
        transports: ['websocket'],
        'force new connection': true
      };

  beforeEach(function(done) {
    var server = require('../../server.js');
    var zerorpc = require("zerorpc");
    spy = sinon.spy();
    // Mocks Python Server.
    rpcMockServer = new zerorpc.Server({
      hello: function(greeting, cb) {
        cb(null, greeting + " Bowie!");
      },
      crunch: function(data, cb) {
        cb(null, data + ' Is there life on Mars?');
      }
    });
    // rpc client is listening on port 8000 in Node.
    rpcMockServer.bind('tcp://127.0.0.1:8000');
    
    // These are our mock clients we'll use to hit the server.
    socket = io.connect('http://localhost:8080', options);
    socket2 = io.connect('http://localhost:8080', options);
    socket3 = io.connect('http://localhost:8080', options);
    // Mocks Swift Message
    socket.emit('message', { "amplitude": "6.66", "time": "4:20" });
    done();
  });
   // We need to clean up the sockets after each test.  Lest feel the wrath of buggy sockets.
  afterEach(function(done) {
    if(socket.connected || socket2.connected || socket3.connected) {
      socket.disconnect();
      socket2.disconnect();
      socket3.disconnect();
      rpcMockServer.close();
      done();
    } else {
      done();
    }
  });

  it('should listen on event and return analyzed data', function(done) {
    socket.on('node.js', function(data) {
      console.log(data);
      expect(data).to.equal('{"amplitude":"6.66","time":"4:20"} Is there life on Mars?');
      done();
    });
  });

  it('should send data to all other socket clients', function(done) {
    socket2.on('/analysisChart', function(data) {
      expect(data).to.deep.equal({ data: '{"amplitude":"6.66","time":"4:20"}'});
    });

    socket3.on('/analysisChart', function(data) {
      expect(data).to.deep.equal({ data: '{"amplitude":"6.66","time":"4:20"}'});
      done();
    });
  });

  it('should return a disconnected event', function(done) {
    socket.emit('/BLEDisconnect');
    // Spy is an anonymous function.  All we're doing here is listening if the disconnected event
    // was fired when we hit /BLEDisconnect in Node.
    socket2.on('disconnected', spy);

    // Packet not yet delivered.
    spy.should.have.not.been.called;

    // Lets wait a bit to resolve the packet.
    setTimeout(function() {
      spy.should.have.been.calledOnce;
      done();
    }, 1000);
  });

});
