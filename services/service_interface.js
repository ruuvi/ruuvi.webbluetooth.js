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
  	//Service-specific
  	console.log("Error, Characteristic write must be defined in serive subclass");
  }

  async readCharacteristic(uuid){
  	//Service-specific
  	console.log("Error, Characteristic read must be defined in serive subclass");
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