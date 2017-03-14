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

class ruuviIMU extends serviceInterface {

  constructor(){
  	super();
  	this.serviceName = "Ruuvi IMU";
  	this.serviceUUID = "0000BBE4-0000-1000-8000-00805F9B34FB".toLowerCase();
  	this.characteristicUUIDs = { "IMU": "0000E153-0000-1000-8000-00805F9B34FB".toLowerCase()};
  	this.characteristicNames = [ "IMU" ];
  	this.serviceHandle = 0;
  	this.IMU = {
        handle: 0,
        UUID: this.characteristicUUIDs.IMU,
        name: "IMU",
        value: 0,
        log: sessionStorage.ruuviIMU_IMU,
        permissions: {
        "read":  1,
        "write": 0,
        "notify": 1,
        "indicate": 0
       },
       onChange: function(event)
       {
       	if(!sessionStorage.ruuviIMU_IMU){
       		sessionStorage.ruuviIMU_IMU = [];
       	}
       	sessionStorage.ruuviIMU_IMU.push([new Date.now(), event.target.value]);
       }

  	};

  }

  getCharacteristicByUUID(uuid){
  	if(uuid == this.IMU.UUID){
  		return this.IMU;
  	} else {
        console.log("Error: Unknown UUID");
  	}
  }

  async connect(serverHandle){
  	try{
    this.serviceHandle = await serverHandle.getPrimaryService(this.serviceUUID);
    this.IMU.handle = await this.serviceHandle.getCharacteristic(this.IMU.UUID);
    this.IMU.handle.addEventListener('characteristicvaluechanged',
      this.IMU.onChange);
    await this.IMU.handle.startNotifications();
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