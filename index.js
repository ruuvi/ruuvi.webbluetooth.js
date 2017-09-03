"use strict"

let connect = async function(deviceNamePrefix){
  let handle = {};
  try {
      let filters = [];
      filters.push({namePrefix: deviceNamePrefix});
      let options = {};
      options.filters = filters;
      //console.log(JSON.stringify(options));
      //Connect to device with Ruuvi IMU service
      let device = await navigator.bluetooth.requestDevice(options);
      handle = await this.device.gatt.connect();
    } catch (error) {
      console.log("Error: " + error);
    }
  }
  return handle;
}

let disconnect = async function(serverHandle){
  try {
    serverHandle.disconnect();
  } catch(error) {
    console.log("Error: " + error);
  }
}

let getServices = async function(serverHandle){
  let services = {};
  try{
    //TODO
  } catch(error) {
    console.log("Error: " + error);
  }
}
/**
 *  connect(deviceNamePrefix) Starts asynchronous search for devices which advertise name that starts with prefix.
 *                            Example: connect("Ruuvi") to connect to devices with name "RuuviTag".
 *                            Returns handle of the connection
 *  disconnect(connection)    Disconnects given connection.
 *  getServices(connection)   Returns array of service objects of given connection.
 **/
module.exports = {
  connect           : connect,
  disconnect        : disconnect,
  getServices       : getServices
}