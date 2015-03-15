# rpi-smartthings
Control your [Raspberry Pi] (http://www.raspberrypi.org) with [SmartThings](http://www.smartthings.com)

## Description
This is a [node.js](https://nodejs.org) server for your Raspberry Pi that allows SmartThings
to discover it over your local network using [SSDP](https://tools.ietf.org/html/draft-cai-ssdp-v1-03) and communicate with
it using RESTful commands.

## Warning
This is a work in progress and the author does not guarantee this to
work.

## Installation Directions
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
$ cd rpi-smartthings
```
 - Install the node modules
```
$ npm install --save
```
