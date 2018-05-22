/*jshint 
    node: true
 */
"use strict";
const serviceInterface = require("./service_interface.js");

class deviceInformation extends serviceInterface {

  constructor(){
    super();
    this.serviceName = "Device Information";
    this.serviceUUID = 0x180A;
    this.characteristicUUIDs = {"Manufacturer": 0x2A29,
                                "Model": 0x2A24,
                                "Serial": 0x2A25,
                                "Hardware": 0x2A27,
                                "Software": 0x2A28,
                                "Firmware": 0x2A26};
    this.serviceHandle = 0;
    this.Manufacturer = {
        handle: 0,
        UUID: this.characteristicUUIDs.Manufacturer,
        name: "Manufacturer",
        value: 0,
        callback: 0,
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 0,
        "indicate": 0
       }
    };
    this.Model = {
        handle: 0,
        UUID: this.characteristicUUIDs.Model,
        name: "Model",
        value: 0,
        callback: 0,
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 0,
        "indicate": 0
       }
    };
    this.Serial = {
        handle: 0,
        UUID: this.characteristicUUIDs.Serial,
        name: "Serial",
        value: 0,
        callback: 0,
        permissions: {
        "read":  0, //Web-ble blacklist
        "write": 0,
        "notify": 0,
        "indicate": 0
       }
    };
    this.Hardware = {
        handle: 0,
        UUID: this.characteristicUUIDs.Hardware,
        name: "Hardware",
        value: 0,
        callback: 0,
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 0,
        "indicate": 0
       }
    };
    this.Software = {
        handle: 0,
        UUID: this.characteristicUUIDs.Software,
        name: "Software",
        value: 0,
        callback: 0,
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 0,
        "indicate": 0
       }
    };
    this.Firmware = {
        handle: 0,
        UUID: this.characteristicUUIDs.Firmware,
        name: "Firmware",
        value: 0,
        callback: 0,
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 0,
        "indicate": 0
       },
       onRead: function(){
        this.log = this.handle.value;
       }
    };
  }
}

module.exports = deviceInformation;