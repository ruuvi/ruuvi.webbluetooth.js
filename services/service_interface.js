/*jshint 
    node: true
 */
"use strict";
class serviceInterface {
  /** Convert 16- or 32-bit UUID into 128-bit UUID string **/
  convertTo128UUID(short) {
    return (short.toString(16) + "-0000-1000-8000-00805F9B34FB".toLowerCase()).padStart(36, "0");
  }

  /** Return UUID of service **/
  getServiceUUID() {
    if (typeof(this.serviceUUID) === "string") {
      return this.serviceUUID;
    } else {
      return this.convertTo128UUID(this.serviceUUID);
    }
  }

  /** Return name of service **/
  getServiceName() {
    return this.serviceName;
  }

  /** Return list of characteristic UUIDs **/
  getCharacteristicUUIDs() {
    let list = [];
    for (let key in this.characteristicUUIDs) {
      // Do not include prototype properties
      //if (Object.prototype.hasOwnProperty.call(foo, key)) {
      //  doSomething(key);
      //}
      if ({}.hasOwnProperty.call(this.characteristicUUIDs, key)) {
        list.push(this.characteristicUUIDs[key]);
      }
    }
    return list;
  }

  /** Return list of characteristic names **/
  getCharacteristicNames() {
    return this.characteristicNames;
  }

  getCharacteristicByUUID(uuid) {
    for (let ii = 0; ii < this.characteristics.length; ii++) {
      if (this.characteristics[ii].UUID == uuid)
        return this.characteristics[ii];
    }
    return 0;
  }

  /** Attempts to write value to characteristic **/
  async writeCharacteristic(uuid, value) {
    let characteristic = this.getCharacteristicByUUID(uuid);
    if (!characteristic || !characteristic.permissions.write) {
      console.log("Error: could not write to " + uuid);
      return;
    }
    await characteristic.handle.writeValue(value);
  }


  /** Will return value of characteristic **/
  async readCharacteristic(uuid) {
    let characteristic = this.getCharacteristicByUUID(uuid);
    if (!characteristic || !characteristic.permissions.read) {
      console.log("Error: could not read " + uuid);
      return "Error";
    }
    return await characteristic.handle.readValue();
  }

  /** Register to notifications from service. Call callback on data. **/
  async registerNotifications(uuid, callback) {
    let characteristic = this.getCharacteristicByUUID(uuid);
    if (!characteristic || !characteristic.permissions.notify) {
      console.log("Error: could not register notifications for " + uuid);
      return;
    }
    characteristic.callback = callback;
    await characteristic.handle.startNotifications();
  }

  /**
   *  Initializes service.
   */
  async init(serverHandle) {
    try {
      this.serviceHandle = await serverHandle.getPrimaryService(this.serviceUUID);
      let characteristics = this.getCharacteristicUUIDs();
      for (let ii = 0; ii < characteristics.length; ii++) {
        let characteristic = this.getCharacteristicByUUID(characteristics[ii]);
        //Continue if characteristic is not known in service
        if (!characteristic) {
          continue;
        }
        try {
          characteristic.handle = await this.serviceHandle.getCharacteristic(characteristic.UUID);
          //Callback can be added later
          characteristic.onChange = function(event) {
            if (this.callback) {
              this.callback(event.target.value);
            }
          }
          //Bind "this" to characteristic
          characteristic.handle.addEventListener('characteristicvaluechanged',
            characteristic.onChange.bind(characteristic));
        } catch (error) {
          console.log(characteristic.name + " error: " + error);
        }
      }
    } catch (error) {
      console.log(this.serviceName + " error: " + error);
    }
  }

  /**
   *  Releases any connection handles as applicable
   */
  async deinit() {
    //Service-specific
    console.log("Error, disconnect must be defined in service subclass");
  }
}
module.exports = serviceInterface;