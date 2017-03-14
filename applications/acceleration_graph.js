//TODO: Move util function to a separate file
function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

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

    printSample(graph, target){
      if(graph.device){
    	  let log = graph.services.IMU.getLog(graph.services.IMU.characteristicUUIDs.IMU);
    	  let numLines = log.length;
    	  if(graph.latestSample++ < numLines){
          let sample = log[graph.latestSample];
          let data = new DataView(str2ab(sample[1]));
    	  $(target).append(sample[0] + ": X: " + data.getInt16(0) + " Y: " + data.getInt16(2) + " Z: " + data.getInt16(4) + "\n"); //Print time, value
        }
      }
    }
}
