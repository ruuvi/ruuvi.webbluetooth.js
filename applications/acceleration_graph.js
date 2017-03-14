class accelerationGraph{
	constructor(){
		this.device = 0;
		this.services = { IMU: new ruuviIMU()};
        this.latestSample = 0;
	}

	async connect(){
		
	  try {
	  	let filters = [];
  		//filters.push({services: [this.services.IMU.getServiceUUID()]}); TODO: Advertise service on ruuvitag
                filters.push({namePrefix: "Ruuvi"});
                filters.push({services: [this.services.IMU.getServiceUUID()]});

  		let options = {};
  		options.filters = filters;
  		console.log(JSON.stringify(options));
  		//Connect to device with Ruuvi IMU service
	    this.device = await navigator.bluetooth.requestDevice(options);
        this.serverHandle = await this.device.gatt.connect();

        //Connect Ruuvi IMU service to device
        await this.services.IMU.connect(this.serverHandle);

		} catch (error) {
			console.log("Error: " + error);
		}
	}

    printSample(target){
        if(!this.device) return;
    	let log = this.services.IMU.getLog(this.services.IMU.characteristicUUIDs.IMU);
    	let numLines = log.length;
    	if(this.latestSample++ < numLines){
    	$(target).append(log[RXLine][0] + ": " + log[RXLine][1] + "\n"); //Print time, value
        }
    }
}
