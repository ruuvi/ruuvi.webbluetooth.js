/*jshint 
    node: true
 */
"use strict";
var NORDIC_UART = require("./services/nordic_uart.js");

var handle = {};
/** Known services **/
var serviceList = [NORDIC_UART];
/** Initialized services **/
var servicesAvailable = {};

let initServices = async function(serverHandle, services){
  try{
    console.log('Initializing services');
      //Search through list of known services
      for (const service of services) {
        //If connection includes a known service
        let uuid = service.uuid;
        for(const interface of serviceList) {
          if(uuid == interface.getServiceUUID()){
            //Initialise service
            await interface.init(handle);
            //Add to list of services
            let name = interface.getName();
            servicesAvailable[name] = service;
          }
        }
      }
  } catch(error) {
    console.log("Error: " + error);
  }
};

let connect = async function(deviceNamePrefix){

  try {
      let filters = [];
      filters.push({namePrefix: deviceNamePrefix});
      let options = {};
      options.filters = filters;
      let device = await navigator.bluetooth.requestDevice(options);
      handle = await this.device.gatt.connect();
      console.log('Getting Services...');
      services = await server.getPrimaryServices();
      await initServices(handle, services);
    } catch (error) {
      console.log("Error: " + error);
    }
  return handle;
};

let disconnect = async function(serverHandle){
  try {
    serverHandle.disconnect();
  } catch(error) {
    console.log("Error: " + error);
  }
};

let getServices = function(){
  return servicesAvailable;
};

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
};