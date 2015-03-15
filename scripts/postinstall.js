#!/usr/bin/env node

//https://docs.npmjs.com/misc/scripts
console.log("post install script")

var util = require('util');

var emitter = require('events').EventEmitter,
    parseEmitter = new emitter();

var fs = require('fs'),
    xml2js = require('xml2js');

var prompt = require('prompt');
prompt.colors = false; 


var parser = new xml2js.Parser({explicitArray : false});

function getValue(trigger){
  fs.readFile(__dirname + '/../public/device.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
      if (err) { return onErr(err); }
      trigger.emit('log', result.root.device.friendlyName, result.root.device.UDN);
    });
  });
}

parseEmitter.on('log', function(fName, udn) {
  var schema = {
    properties: {
      fName: {
        message: 'friendlyName',
        default: fName
      },
      udn: {
        message: 'UDN',
        default: udn
      }
    }
  };
  prompt.start();
  prompt.get(schema, function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    console.log('  friendlyName: ' + result.fName);
    console.log('  UDN: ' + result.udn);
  });
});

getValue(parseEmitter);

function onErr(err) {
  console.error(err);
  return 1;
}

