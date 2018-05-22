/*jshint 
    node: true
 */
"use strict";
const serviceInterface = require("./service_interface.js");

class batteryService extends serviceInterface {

    constructor() {
        super();
        this.serviceName = "Battery Service";
        this.serviceUUID = 0x180F;
        this.characteristicUUIDs = {
            "Battery": 0x2A19
        };
        this.serviceHandle = 0;
        this.Battery = {
            handle: 0,
            UUID: this.characteristicUUIDs.Battery,
            name: "Battery",
            value: 0,
            callback: 0,
            permissions: {
                "read": 1,
                "write": 0,
                "notify": 1,
                "indicate": 0
            }
        };
        this.characteristics = [this.Battery];
    }
}

module.exports = batteryService;