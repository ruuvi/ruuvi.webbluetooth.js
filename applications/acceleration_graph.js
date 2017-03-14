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
	constructor(chartID){
		this.device = 0;
		this.services = { IMU: new ruuviIMU()};
    this.latestSample = 0;

    this.seriesOptions = [
      { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.1)', lineWidth: 3 },
      { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.1)', lineWidth: 3 },
      { strokeStyle: 'rgba(0, 0, 255, 1)', fillStyle: 'rgba(0, 0, 255, 0.1)', lineWidth: 3 }
    ];

    this.chart = new SmoothieChart({minValue:-10000,maxValue:10000,horizontalLines:[{color:'#ffffff',lineWidth:1,value:0},{color:'#880000',lineWidth:2,value:3333},{color:'#880000',lineWidth:2,value:-3333}]});
    this.canvas = document.getElementById(chartID);
    this.series = [new TimeSeries(), new TimeSeries(), new TimeSeries()]; //X, Y, Z
    for (let i = 0; i < this.series.length; i++) {
      this.chart.addTimeSeries(this.series[i], this.seriesOptions[i]);
    }
    this.chart.streamTo(this.canvas, 150);
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

    printSample(graph){
      if(graph.device){
    	  let log = graph.services.IMU.getLog(graph.services.IMU.characteristicUUIDs.IMU);
    	  let numLines = log.length;
    	  while(graph.latestSample < numLines){
          let sample = log[graph.latestSample];
          let time = new Date(sample[0])
          let data = new DataView(str2ab(sample[1]));
          graph.series[0].append(time, data.getInt16(0));
          graph.series[1].append(time, data.getInt16(2));
          graph.series[2].append(time, data.getInt16(4));
          graph.latestSample++;
        }
      }
    }
}
