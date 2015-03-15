#!/usr/bin/env node

var util = require('util');
var fs = require('fs');

var modelLookup = {
  '0002':	'Model B Revision 1.0',
  '0003':	'Model B Revision 1.0',
  '0004':	'Model B Revision 2.0',
  '0005':	'Model B Revision 2.0',
  '0006':	'Model B Revision 2.0',
  '0007':	'Model A',
  '0008':	'Model A',
  '0009':	'Model A',
  '000d':	'Model B Revision 2.0',
  '000e':	'Model B Revision 2.0',
  '000f':	'Model B Revision 2.0',
  '0010':	'Model B+',
  '0011':	'Compute Module',
  '0012':	'Model A+',
  'a21041':	'Pi 2 Model B',
  'a01041':	'Pi 2 Model B'
}

fs.readFile('/proc/cpuinfo','utf8', function (err, data) {
  if (err) throw err;
  var jsonObj = data.split('\n');
  var result = {}
  for(var line in jsonObj) {
    var v = jsonObj[line].split(':');
    if (v != "") {
     result[v[0].trim()] = v[1].trim();
    }
  }
  console.log(modelLookup[result.Revision]);
});
