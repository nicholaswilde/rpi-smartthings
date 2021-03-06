# rpi-smartthings
Control your [Raspberry Pi] (http://www.raspberrypi.org) with [SmartThings](http://www.smartthings.com)

## Description
This is a [node.js](https://nodejs.org) server for your Raspberry Pi that allows SmartThings
to discover it over your local network using [SSDP](https://tools.ietf.org/html/draft-cai-ssdp-v1-03) and communicate with
it using [RESTful commands](https://en.wikipedia.org/wiki/Representational_state_transfer).

## Warning
This is a work in progress and the author does not guarantee this to
work.

## Node.js Installation Directions
 - Install node.js
```
$ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
$ sudo dpkg -i node_latest_armhf.deb
```
 - Checkout this repository
```
$ git clone https://github.com/nicholaswilde/rpi-smartthings.git
```
 - Change directory
```
$ cd rpi-smartthings/
```
 - Install the node modules
```
$ npm install --save
```
 - Run node
```
$ npm start
```

## SmartThings SmartApp & Device-Type installation Directions

## Troubleshooting
 - Ensure that the SSDP server is running on the Raspberry Pi. On a 
separate computer, run `gupnp-tools`.
```
$ gssdp-discover -i eth0 --timeout=3 --target=urn:schemas-upnp-org:device:RaspberryPiDevice:1
```
