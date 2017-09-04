/*jshint 
    node: true
 */
"use strict";
var NORDIC_UART = require("./services/nordic_uart.js");
var uart = new NORDIC_UART();

var handle = {};
/** Known services **/
var serviceList = [uart];
/** Initialized services **/
var servicesAvailable = {};

let initServices = async function(serverHandle, services){
  try{
    console.log('Initializing services');
      //Search through list of known services
      for (const service of services) {
        //If connection includes a known service
        let uuid = service.uuid;
        for(const iface of serviceList) {
          if(uuid == iface.getServiceUUID()){
            //Initialise service
            await iface.init(handle);
            //Add to list of services
            let name = iface.getName();
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
      /** List services we can use **/
      let optionalServices = [];
      for(const iface of serviceList) {
        optionalServices.push(iface.getServiceUUID());
      }
      //XXX test invalid
      optionalServices.push("0x1234");
      options.filters = filters;
      options.optionalServices = optionalServices;
      //options.acceptAllDevices = true;
      let device = await navigator.bluetooth.requestDevice(options);
      handle = await device.gatt.connect();
      console.log('Getting Services...');
      //Work around bug in web blue implementation which fails on getting all services
      let services = [];
      for(const iface of serviceList) {
        let service = await handle.getPrimaryService(iface.getServiceUUID());
        if(service){
          services.push(service);
        }
      }
      
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