/** Load service interface **/
function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- This is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}

require("../services/service_interface.js");

class nordicUART extends serviceInterface {

  constructor(){
  	super();
  	this.serviceName = "Nordic UART";
  	this.serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase();
  	this.characteristicUUIDs = { "TX": "6E400002-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase(),
  	                             "RX": "6E400003-B5A3-F393-E0A9-E50E24DCCA9E".toLowerCase()};
  	this.characteristicNames = [ "TX", "RX"];
  	this.serviceHandle = 0;
  	this.TX = {
        handle: 0,
        UUID: this.characteristicUUIDs.TX,
        name: "TX",
        value: 0,
        notificationLog: sessionStorage.nordicUART_TX,
        permissions: {
        "read":  0,
        "write": 1,
        "notify": 0,
        "indicate": 0
       },
       onChange: function(event)
       {
       	if(!sessionStorage.nordicUART_TX){
       		sessionStorage.nordicUART_TX = [];
       	}
       	sessionStorage.nordicUART_TX.push([new Date.now(), event.target.value]);
       }

  	};
  	this.RX = {
        handle: 0,
        UUID: this.characteristicUUIDs.RX,
        name: "RX",
        value: 0,
        log: sessionStorage.nordicUART_RX,
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 1,
        "indicate": 0
       },
       onChange: function(event)
       {
       	if(!sessionStorage.nordicUART_RX){
       		sessionStorage.nordicUART_RX = [];
       	}
       	sessionStorage.nordicUART_RX.push([new Date.now(), event.target.value]);
       }
  	};
  }

  getCharacteristicByUUID(uuid){
  	if(uuid == this.TX.UUID){
  		return this.TX;
  	} else if (uuid == this.RX.UUID) {
        return this.RX;
  	} else {
        console.log("Error: Unknown UUID");
  	}
  }

  async connect(serverHandle){
  	try{
    this.serviceHandle = await serverHandle.getPrimaryService(this.serviceUUID);
    this.TX.handle = await this.serviceHandle.getCharacteristic(this.TX.UUID);
    this.TX.handle.addEventListener('characteristicvaluechanged',
      this.TX.onChange);
    this.RX.handle = await serviceHandle.getCharacteristic(this.RX.UUID);
    this.RX.handle.addEventListener('characteristicvaluechanged',
      this.RX.onChange);
    await this.RX.handle.startNotifcations();
    } catch (error) {
    	console.log(this.serviceName + " error: " + error);
    }
  }

  getLog(uuid){
  	let characteristic = this.getCharacteristicByUUID(uuid);
  	return characteristic.log;
  }

  async disconnect(){
    //TODO
  }

  async writeCharacteristic(uuid, value){
  	let characteristic = this.getCharacteristicByUUID(uuid);
  	if(!characteristic.permissions.write){
  		console.log("Error: Write not allowed for " + characteristic.name);
  		return;
  	}
  	await characteristic.handle.writeValue(value);
  }

  async readCharacteristic(uuid){
  	let characteristic = this.getCharacteristicByUUID(uuid);
  	if(!characteristic.permissions.read){
  		console.log("Error: Read not allowed for " + characteristic.name);
  		return;
  	}
  	return await characteristic.readValue();
  }
}