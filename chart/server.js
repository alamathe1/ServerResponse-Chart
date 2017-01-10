var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var Random = require('random-js');
var app = express();


app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', express.static('frontend'))

app.get('/', function (req, res) {
  res.render('index', {title: 'Welcome'})
})

app.post('/server_stat', function (req, res) {
  var data = {
	  target_name : 'New Server',
	  time_range : {
		  start : parseDate(req.body.serverstarttime),
		  end : parseDate(req.body.serverendtime),
		  recordCount : 3,
	  },
  };
  
  var random = new Random();
  
  var starttime = data.time_range.start - 100000000;
  var endtime = data.time_range.end - 100000000;
  
  var items = [];
  for(i = 0; i < data.time_range.recordCount; i++){
	 items.push({
		timestamp : random.integer(starttime, endtime) + 100000000,
		charttype : req.body.charttype,
		memory_usage : random.integer(0,1000),
		memory_available : random.integer(0,1000),
		cpu_usage : random.integer(0,1),
		network_throughput : {
		  in : random.integer(0,1000),
		  out : random.integer(0,1000),
		},
		network_packet : {
		  in : random.integer(0,1000),
		  out : random.integer(0,1000)
		},
		errors : {
		  system : random.integer(0,1000),
		  sensor : random.integer(0,1000),
		  component : random.integer(0,1000)
		}		
	 })
  }
  
  items.sort(function(a, b){
    var keyA = a.timestamp, keyB = b.timestamp;
    if(keyA < keyB) return 1;
    if(keyA > keyB) return -1;
    return 0;
  });
  
  data.items = items;  
	
  res.json({success : true, data : data});
});

function parseDate(input) {
  var parts = input.split('-');
  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]).getTime(); // Note: months are 0-based
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
