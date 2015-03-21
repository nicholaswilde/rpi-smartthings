#!/usr/bin/env node

// File locations
var deviceFilePath = __dirname + '/../public/device.xml',
    cpuinfoFilePath = '/proc/cpuinfo'

// Require all npm modules
var fs = require('fs'),
    prompt = require('prompt'),
    parser2 = require('xmldom').DOMParser,
    serializer = new (require('xmldom').XMLSerializer),
    uuid = require('node-uuid');

// Remove Prompt colors
prompt.colors = false;

// Array for looking up Raspberry Pi model names
var modelLookup = {
  '0002':       'Model B Revision 1.0',
  '0003':       'Model B Revision 1.0',
  '0004':       'Model B Revision 2.0',
  '0005':       'Model B Revision 2.0',
  '0006':       'Model B Revision 2.0',
  '0007':       'Model A',
  '0008':       'Model A',
  '0009':       'Model A',
  '000d':       'Model B Revision 2.0',
  '000e':       'Model B Revision 2.0',
  '000f':       'Model B Revision 2.0',
  '0010':       'Model B+',
  '0011':       'Compute Module',
  '0012':       'Model A+',
  'a21041':     'Pi 2 Model B',
  'a01041':     'Pi 2 Model B'
}

// Perform tasks in parallel
// http://book.mixu.net/node/ch7.html#full-parallel
function fullParallel(callbacks, last) {
  var results = [];
  var result_count = 0;
  callbacks.forEach(function(callback, index) {
    callback( function() {
      results[index] = Array.prototype.slice.call(arguments);
      result_count++;
      if(result_count == callbacks.length) {
        last(results);
      }
    });
  });
}

// Read the Device.xml file for settings
function readDevice(arg, callback) {
  fs.readFile(deviceFilePath, 'utf8', function(err, data) {
    var doc = new parser2().parseFromString(data.substring(2, data.length)),
        x = doc.documentElement.getElementsByTagName(arg)[0].childNodes[0];
    callback(arg, serializer.serializeToString(x));
  });
}

// Read /proc/cpuinfo for settings
function readCpuinfo(arg, callback) {
  fs.readFile(cpuinfoFilePath,'utf8', function (err, data) {
    if (err)  { return onErr(err); }
    var jsonObj = data.split('\n');
    var result = {}
    for(var line in jsonObj) {
      var v = jsonObj[line].split(':');
      if (v != "") {
       result[v[0].trim()] = v[1].trim();
      }
    }
    if (arg === 'Revision') {
      var v = modelLookup[result[arg]];
      arg = 'modelName';
    } else if (arg === 'Serial') {
      var v = result[arg];
      arg = 'serialNumber';
    } else if (arg ==='modelNumber') {
      var v = result['Revision'];
    } else { var v = result[arg]; }
    callback(arg, v);
  });
}

// Get prompt
function getPrompt(results) {
  // Prompt properties and defaults
  var schema = {
    properties: {
      fName: {
        message: 'friendlyName',
        default: findValue(results, 'friendlyName')
      },
      udn: {
        message: 'UDN',
        default: findValue(results, 'UDN')
      }
    }
  };
  prompt.start();
  prompt.get(schema, function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    console.log('  friendlyName: ' + result.fName);
    console.log('  UDN: ' + result.udn);
    writeXml(results);
  });
}

// Write XML Document
function writeXml(results) {
  var fileData = fs.readFileSync(deviceFilePath, 'utf8');
  var doc = new parser2().parseFromString(fileData.substring(2, fileData.length));
  var x = replaceNodes(doc, results);
  console.log(serializer.serializeToString(x));
}

// Replace all node values
function replaceNodes(doc, results) {
  for(var i = 0; i<results.length; i++) {  
    var key = results[i][0],
        value = results[i][1],
        newNode = doc.createElement(key); // Create a new node
    newNode.appendChild(doc.createTextNode(value)); // Append the new value to the new node
    var y = doc.getElementsByTagName(key)[0] // Get the oringinal node
    doc.documentElement.replaceChild(newNode, y) // Replace the original node with the new
  }
  return doc
}

fullParallel([
  function(next) { readDevice('friendlyName', next); },
  function(next) { readDevice('UDN', next); },
  function(next) { readCpuinfo('Revision', next); },
  function(next) { readCpuinfo('Serial', next); },
  function(next) { readCpuinfo('modelNumber', next); }
], getPrompt);

// Handle errors
function onErr(err) {
  console.error(err);
  return -1;
}

// Find value in multidimensional array
function findValue(array, nameWeAreLookingFor) {
  for(var i = 0; i<array.length; i++) {
      if(array[i][0] === nameWeAreLookingFor) return array[i][1];
  }
  return -1;
}
