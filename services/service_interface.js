/*jshint 
    node: true
 */
"use strict";
class serviceInterface{

  /** Return UUID of service **/
  getServiceUUID(){
  	return this.serviceUUID;
  }

  /** Return name of service **/
  getServiceName(){
  	return this.serviceName;
  }

  /** Return list of characteristic UUIDs **/
  getCharacteristicUUIDs(){
    let list = [];
    for (key in this.characteristicUUIDs) {
      // Do not include prototype properties
      //if (Object.prototype.hasOwnProperty.call(foo, key)) {
      //  doSomething(key);
      //}
      if ({}.hasOwnProperty.call(this.characteristicUUIDs, key)) {
        list.push(this.characteristicUUIDs[key]);
      }
    }
  	return ;
  }

  /** Return list of characteristic names **/
  getCharacteristicNames(){
  	return this.characteristicNames;
  }

  getCharacteristicByUUID(uuid){
    for(characteristic in this.characteristics){
      if(characteristic.UUID == uuid)
        return characteristic;
    }
    return 0; 
  }

  /** Attempts to write value to characteristic **/
  async writeCharacteristic(uuid, value){
    let characteristic = this.getCharacteristicByUUID(uuid);
    if(!characteristic || !characteristic.permissions.write){
      console.log("Error: could not write to " + uuid);
      return;
    }
    await characteristic.handle.writeValue(value);
  }


  /** Will return value of characteristic **/
  async readCharacteristic(uuid){
    let characteristic = this.getCharacteristicByUUID(uuid);
    if(!characteristic || !characteristic.permissions.read){
      console.log("Error: could not read " + uuid);
      return;
    }
    return await characteristic.readValue();
  }

  /** Register to notifications from service. Call callback on data. **/
  async registerNotifications(uuid, callback){
    let characteristic = this.getCharacteristicByUUID(uuid);
    if(!characteristic || !characteristic.permissions.notify){
      console.log("Error: could not register notifications for " + uuid);
      return;
    }
    characteristic.callback = callback;
    await characteristic.startNotifications();  
  }

  /**
   *  Initializes service.
   */
  async init(serverHandle){
    try{
      this.serviceHandle = await serverHandle.getPrimaryService(this.serviceUUID);
      let characteristics = this.getCharacteristicUUIDs();
      for(uuid in characteristics){
        let characteristic = this.getCharacteristicByUUID(uuid);
        characteristic.handle = await this.serviceHandle.getCharacteristic(this.TX.UUID);
        characteristic.onChange = function(event) 
        {
          if(this.callback){
            callback(event.target.value);
          }
        }
        //TODO: Verify scope of "this" after bind
        characteristic.onChange.bind(characteristic);
        characteristic.handle.addEventListener('characteristicvaluechanged',
                                                characteristic.onChange);
      }  
    } catch (error) {
      console.log(this.serviceName + " error: " + error);
    }
  }

  /**
   *  Releases any connection handles as applicable
   */
  async deinit(){
  	//Service-specific
  	console.log("Error, disconnect must be defined in serive subclass");
  }
}
module.exports = serviceInterface;