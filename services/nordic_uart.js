/*jshint 
    node: true
 */
"use strict";
var serviceInterface = require("./service_interface.js");

class nordicUART extends serviceInterface {

  constructor(){
  	super();
  	this.serviceName = "Nordic UART";
  	this.serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase();
  	this.characteristicUUIDs = { "TX": "6E400003-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase(),
  	                             "RX": "6E400002-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase()};
  	this.serviceHandle = 0;
  	this.TX = {
        handle: 0,
        UUID: this.characteristicUUIDs.TX,
        name: "TX",
        value: 0,
        callback: 0, // TODO: Can permissions be read from characteristic?
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 1,
        "indicate": 0
       }
  	};
  	this.RX = {
        handle: 0,
        UUID: this.characteristicUUIDs.RX,
        name: "RX",
        value: 0,
        callback: 0,
        permissions: {
        "read":  0,
        "write": 1,
        "notify": 0,
        "indicate": 0
       }
  	};
    this.characteristics = [this.TX, this.RX];
  }
}

module.exports = nordicUART;