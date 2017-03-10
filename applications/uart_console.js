class UARTConsole{
	constructor(){
		this.device = 0;
		this.services = { UART: new nordicUART()};
		this.RXLine = 0;
	}

	async connect(){
		
	  try {
	  	let filters = [];
  		filters.push({services: [this.services.UART.getServiceUUID()]});

  		let options = {};
  		options.filters = filters;
  		console.log(JSON.stringify(options));
  		//Connect to device with Nordic UART service
	    this.device = await navigator.bluetooth.requestDevice(options);
        this.serverHandle = await this.device.gatt.connect();

        //Connect nordic UART service to device
        await this.services.UART.connect(this.serverHandle);

		} catch (error) {
			console.log("Error: " + error);
		}
	}

    printRX(target){
    	let log = this.services.UART.getLog(this.services.UART.characteristicUUIDs.RX);
    	let numLines = log.length;
    	while(RXLine++ < numLines){
    	$(target).append(log[RXLine][0] + ": " + log[RXLine][1] + "\n"); //Print time, value
        }
    }

    async sendTX(line){
        //Split line to 20 char chunks
        let runner = 0;
    	while(runner < line.length){
    		let tx = line.substring(runner, runner + 20);
    		runner += 20;
    		try {
    		await this.services.UART.writeCharacteristic(this.services.UART.characteristicUUIDs.TX, tx);
    		} catch(error) {
    			console.log("Error: " + error);
    		}
    	}
    }


}