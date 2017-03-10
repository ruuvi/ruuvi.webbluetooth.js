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
  	return this.characteristicUUIDs;
  }

  /** Return list of characteristic names **/
  getCharacteristicNames(){
  	return this.characteristicNames;
  }

  async writeCharacteristic(uuid, value){
  	await this.getCharacteristicByUUID(uuid).write(value);
  }

  async readCharacteristic(uuid){
  	return await this.getCharacteristicByUUID(uuid).read();
  }

  /** Register for notifications. Notification data can be read from NotificationLogs. **/
  async registerNotification(uuid){
  	await this.getCharacteristicByUUID(uuid).registerNotifications();
  }

  /** Unregister for notifications, wipe notification log **/
  async unregisterNotification(uuid){
  	await this.getCharacteristicByUUID(uuid).registerNotifications();
  }

  getLog(uuid){
  	//Service-specific
  	console.log("Error, getLog must be defined in serive subclass");
  }

  connect(){
  	//Service-specific
  	console.log("Error, connect must be defined in serive subclass");
  }

  disconnect(){
  	//Service-specific
  	console.log("Error, disconnect must be defined in serive subclass");
  }
}