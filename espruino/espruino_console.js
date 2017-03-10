class espruinoConsole{
	constructor(){
		this.device = 0;
		this.services = { UART: new nordicUART()};
	}

	async connect(){
		console.log(this.services.UART.getServiceUUID());
		
	  try {
	  	let filters = [];
  		filters.push({services: [this.services.UART.getServiceUUID()]});

  		let options = {};
  		options.filters = filters;
  		console.log(JSON.stringify(options));
	    this.device = await navigator.bluetooth.requestDevice(options);
		} catch (error) {
			console.log("Error: " + error);
		}
	}
}