/*
 * Import modules
 */
var express = require('express');
var server = express();
var ip = require('ip');
var path = require('path');
var os = require('os');
var gpio = require('pi-gpio');

/*
 * Grab parameters
 */

var port = normalizePort(process.env.PORT || '3000');
var deviceFile = 'device.xml';
var udn = process.env.UDN || 'uuid:f40c2981-7329-40b7-8b04-27f187aecfb5'
var usn = process.env.USN || 'urn:schemas-upnp-org:device:RaspberryPiDevice:1'

/*
 * Configure Server
 */

// Make files in the public directory accessible
server.use(express.static(path.join(__dirname, 'public')));

/*
 * Configure SSDP
 */

var loc = "http://" + ip.address() + ":" + port + '/' + deviceFile
var SSDP = require('node-ssdp').Server
  , ssdp = new SSDP({
                      location: loc,
                      udn: udn
                   });

ssdp.addUSN(usn);

/*
 * GPIO Stuff
 */

// Get status of pin
server.get('/pin/:pin', function(req, res){
  var pin = req.params.pin;
  gpio.open(pin, 'input', function(err) {
    gpio.getDirection(pin, function(err, direction) {
      gpio.read(pin, function(err, value) {
        var jsonObj = {
          'data': {
            'name': 'Pin ' + pin,
            'type': 'digital',
            'value': value,
            'direction': direction,
            'unit': 'none'
          }
        }
        console.log(jsonObj);
        res.status(200).send(jsonObj);
        gpio.close(pin);
      });
    });
  });
});

/*
 * REST functions
 */
server.use('/public/device.xml', function (req, res, next) {
  console.log('/device.xml');
  next();
});


// Get CPU temperature
server.get('/cpuTemp', function (req, res) {
  var fs = require('fs');
  var temp = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp','utf8');
  temp = (temp/1000).toPrecision(3);
  var jsonObj = {
    'data': {
      'name': 'CPU Temperature',
      'type': 'analog',
      'value': temp,
      'direction': 'none',
      'unit': 'F'
    }
  }
  console.log(jsonObj);
  res.send(jsonObj);
});

// Get free memory
server.get('/freeMem', function(req, res) {
  var freeMem = (os.freemem()/1024000).toPrecision(4);
  var jsonObj = {
    'data': {
      'name': 'Free Memory',
      'type': 'analog',
      'value': freeMem,
      'direction': 'none',
      'unit': 'MB'
    }
  }
  console.log(jsonObj);
  res.status(200).send(jsonObj);
});

server.get('/totalMem', function(req, res) {
  var totalMem = (os.totalmem()/1024000).toPrecision(4);
  var jsonObj = {
    'data': {
      'name': 'Total Memory',
      'type': 'analog',
      'value': totalMem,
      'direction': 'none',
      'unit': 'MB'
    }
  }
  console.log(jsonObj);
  res.status(200).send(jsonObj);
});

// Get used memory
server.get('/usedMem', function(req, res) {
  var usedMem = ((os.totalmem()-os.freemem())/1024000).toPrecision(4);
  var jsonObj = {
    'data': {
      'name': 'Used Memory',
      'type': 'analog',
      'value': usedMem,
      'direction': 'none',
      'unit': 'MB'
    }
  }
  console.log(jsonObj);
  res.status(200).send(jsonObj);
});

// Express route for any other unrecognised incoming requests
server.get('*', function(req, res){
  var jsonObj = {
    'error': {
      'code': 404,
      'message': 'ID not found'
    }
  }
  res.status(404).send(jsonObj);
});

/*
 * Start SSDP Server
 */

console.log('Starting SSDP server');
ssdp.start(function(){});

/*
 * Start Server
 */

server.listen(port, function () {
  console.log('Server is listening at http://%s:%s', ip.address(), port);
});


/*********************
 * Helping functions *
 *********************/

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/*
// Get CPU temperature
function getTemp(callback) {
  var fs = require('fs')
  fs.readFile('/sys/class/thermal/thermal_zone0/temp','utf8', function (err,data) {
    if (err) {
      console.log(err);
      return false;
    }
    data = (data/1000).toPrecision(3);
    return callback(data);
  });
}

*/
