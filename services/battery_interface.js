/*jshint 
    node: true
 */
"use strict";
const serviceInterface = require("./service_interface.js");

class batteryService extends serviceInterface{

    constructor(){
        super();
        this.serviceName = "Battery Service";
        this.serviceUUID = 0x180F;
        this.characteristicUUIDs = {"Battery": 0x2A19};
        this.characteristicNames = [ "Battery" ];
        this.serviceHandle = 0;
        this.Battery = {
            handle: 0,
            UUID: this.characteristicUUIDs.Battery,
            name: "Battery",
            value: 0,
            log: {},
            permissions: {
                "read":  1,
                "write": 0,
                "notify": 1,
                "indicate": 0
            },
            onRead: function(){
            this.log = this.handle.value;
            }
         };
    }
    

  getCharacteristicByUUID(uuid){
    if(uuid == this.Battery.UUID){
        return this.Battery;
    } else {
        console.log("Error: Unknown UUID");
        return 0;
    }
  }

  async connectServer(serverHandle){
    try{
    this.serviceHandle = await serverHandle.getPrimaryService(this.serviceUUID);
    this.Battery.handle = await this.serviceHandle.getCharacteristic(this.Battery.UUID);
    //this.Manufacturer.handle.addEventListener('characteristicvaluechanged',
    //  this.ManufacturerEventHandler.bind(this)); Only works with charctreristics that have notifications enabled?
    await this.Battery.handle.startNotifications();
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