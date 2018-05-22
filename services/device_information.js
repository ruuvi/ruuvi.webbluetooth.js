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
    this.characteristicNames = [ "Manufacturer", "Model", "Serial", "Hardware", "Software", "Firmware" ];
    this.serviceHandle = 0;
    this.Manufacturer = {
        handle: 0,
        UUID: this.characteristicUUIDs.Manufacturer,
        name: "Manufacturer",
        value: 0,
        log: {},
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
    this.Model = {
        handle: 0,
        UUID: this.characteristicUUIDs.Model,
        name: "Model",
        value: 0,
        log: {},
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
    this.Serial = {
        handle: 0,
        UUID: this.characteristicUUIDs.Serial,
        name: "Serial",
        value: 0,
        log: {},
        permissions: {
        "read":  0, //Web-ble blacklist
        "write": 0,
        "notify": 0,
        "indicate": 0
       },
       onRead: function(){
        this.log = this.handle.value;
       }
    };
    this.Hardware = {
        handle: 0,
        UUID: this.characteristicUUIDs.Hardware,
        name: "Hardware",
        value: 0,
        log: {},
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
    this.Software = {
        handle: 0,
        UUID: this.characteristicUUIDs.Software,
        name: "Software",
        value: 0,
        log: {},
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
    this.Firmware = {
        handle: 0,
        UUID: this.characteristicUUIDs.Firmware,
        name: "Firmware",
        value: 0,
        log: {},
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

  getCharacteristicByUUID(uuid){
    if(uuid == this.Manufacturer.UUID){
        return this.Manufacturer;
    } else if(uuid == this.Model.UUID){
        return this.Model;
    } else if(uuid == this.Serial.UUID){
        return this.Serial;
    } else if(uuid == this.Hardware.UUID){
        return this.Hardware;
    } else if(uuid == this.Software.UUID){
        return this.Software;
    } else if(uuid == this.Firmware.UUID){
        return this.Firmware;
    } else {
        console.log("Error: Unknown UUID");
        return 0;
    }
  }

  async connectServer(serverHandle){
    try{
    this.serviceHandle = await serverHandle.getPrimaryService(this.serviceUUID);
    this.Manufacturer.handle = await this.serviceHandle.getCharacteristic(this.Manufacturer.UUID);
    //this.Manufacturer.handle.addEventListener('characteristicvaluechanged',
    //  this.ManufacturerEventHandler.bind(this)); Only works with charctreristics that have notifications enabled?
    this.Model.handle = await this.serviceHandle.getCharacteristic(this.Model.UUID);
    //this.Serial.handle = await this.serviceHandle.getCharacteristic(this.Serial.UUID);
    this.Hardware.handle = await this.serviceHandle.getCharacteristic(this.Hardware.UUID);
    this.Firmware.handle = await this.serviceHandle.getCharacteristic(this.Firmware.UUID);
    this.Software.handle = await this.serviceHandle.getCharacteristic(this.Software.UUID);
    } catch (error) {
        console.log(this.serviceName + " error: " + error);
    }
  }

  getLog(uuid){
    return this.log;
  }

  async disconnectServer(){
    //TODO
  }
}