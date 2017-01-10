require([
	'backbone',
	'datepicker',
	'timepicker',
	'datepair',
	'CanvasJS',
	'colorpicker'
],function(Backbone, datepicker, timepicker, Datepair, CanvasJS, colorpicker){
	
	
    var app = {};

    _.extend(app, Backbone.Events);
	
	VisualChartModel = Backbone.Model.extend({
		defaults : {
			cpu_usage : {
				name : 'CPU Usage',
				color : '#0099ff'
			},
			errors_system : {
				name : 'Error System',
				color : '#0099ff'
			},
			errors_component : {
				name : 'Error Component',
				color :'#0099ff' 	
			},
			errors_sensor : {
				name : 'Error Sensor',
				color : '#0099ff'	
			},
			memory_available : {
				name : 'Memory available',
				color : '#0099ff'	
			},
			memory_usage : {
				name : 'Memory Usage',
				color : '#0099ff'
			},
			network_packet_in : {
				name : 'Network Packet In',
				color : '#0099ff'
			},
			network_packet_out : {
				name : 'Network Packet Out',
				color : '#0099ff'	
			},	
			network_throughput_in : {
				name : 'Network throughput In',
				color : '#0099ff'	
			},
			network_throughput_out : {
				name : 'Network throughput out',
				color : '#0099ff'
			}
		}
	});
	
	var VisualChartConfigurationView = Backbone.View.extend({
		
		className : "visual-chart-configuration",	
		
		events : {
			"click .changeconfiguration" : 'onSubmitConfiguration'
		},
		
		initialize : function(){
			this.render();
			_.defer(_.bind(function(){
				$('.colorpicker').colorpicker({
					format : 'hex',
					color : '#0099ff',
				});
			},this),1000);
		},
		
		onSubmitConfiguration : function(event){
			event && event.preventDefault();
			_this = this;
			
			this.$('input').each(function(key, elm){
				var key = $(elm).data('key');
				var subkey = $(elm).data('subkey');
				var value = $(elm).val();
				
				var updateKey = _this.model.get(key);
				updateKey[subkey] = value;
				
				_this.model.set(key,updateKey);
			})			
			
			app.trigger('show:visualchart');
		},
		
		render : function(){
			var data = {
				data : this.model.toJSON()
			};
			
			var template = _.template(t_visualchartconfiguration.innerHTML);
			this.$el.html(template(data));			
		}
	
	});
	
	var VisualChartView = Backbone.View.extend({
		
		className : "visual-chart",	
		
		data : [],
		
		initialize : function(){
		  this.listenTo(this.model,"change",this.bindDataForChart);	
		  this.listenTo(app,'show:visualchart',this.bindDataForChart);	
		  this.model = new VisualChartModel();	
		  this.render();		  
		},
		
		bindDataForChart : function(){	
			console.log('wecwececw');
			var data = {};
			var _this = this;
			var defaults = this.model.toJSON();
			this.data = [];
			
			this.collection.forEach(function(model,index){
				var model = model.toJSON();
				var timestamp = model.timestamp;
				var date = new Date(timestamp);
				console.log(date.getFullYear());
				var charttype = model.charttype;
				
				delete model.timestamp;
				
				delete model.charttype;
				
				_.each(model,function(value,key){
					if(!data[key]){
						if(_.isObject(value)){
							_.each(value, function(innervalue, innerkey){
								if(!data[key + '_' + innerkey]) {
									data[key + '_' + innerkey] = {
										name : defaults[key + '_' + innerkey].name,
										type: charttype,
										lineThickness:3,
										axisYType:"primary",
										color: defaults[key + '_' + innerkey].color,
										showInLegend: true, 
										dataPoints: [
											{ x: new Date(date.getFullYear(),date.getMonth()), y: innervalue },
										]
									};
								}else{
									data[key + '_' + innerkey].dataPoints.push({
										 x: new Date(date.getFullYear(),date.getMonth()), y: innervalue,
									})					
								}
								
							})
						}else{
							data[key] = {
								name : defaults[key].name,
								type: charttype,
								lineThickness:3,
								color: defaults[key].color,
								axisYType:"primary",
								showInLegend: true, 
								dataPoints: [
									{ x: new Date(date.getFullYear(),date.getMonth()), y: value },
								]
							};
						}							
					}else{						
						data[key].dataPoints.push({
							 x: new Date(date.getFullYear(),date.getMonth()), y: value,
						})					
					} 				
				});
			})
			
			_.each(data, function(value, key){
				_this.data.push(value);
			});
			
			// Render Visual Chart;
			this.renderVisualChart();
		},
		
		resetCanvas : function(){
			if(this.chart !== undefined){
				_.each(this.chart.data,function(value,key){					
					value.remove();
				})
				
				this.chart.options.data = this.data;
				this.chart.render();	
				return true;
			}else{
				return false;
			}
		},
		
		renderVisualChart : function(){
			if(this.resetCanvas()) return;
			
			var chart = this.chart = new CanvasJS.Chart("chartContainer",
				{
				zoomEnabled: false,
				animationEnabled: true,
				title:{
					text: "Server Status"
				},
				axisY2:{
					valueFormatString:"0",				
					maximum: 1100,
					interval: 100,
					interlacedColor: "#F5F5F5",
					gridColor: "#D7D7D7",      
					tickColor: "#D7D7D7"								
				},
				theme: "theme2",
				toolTip:{
						shared: true
				},
				legend:{
					verticalAlign: "bottom",
					horizontalAlign: "center",
					fontSize: 15,
					fontFamily: "Lucida Sans Unicode"

				},				
				data : this.data,		
				legend: {
					cursor:"pointer",
					itemclick : function(e) {
					  if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					  e.dataSeries.visible = false;
					  }
					  else {
						e.dataSeries.visible = true;
					  }
					  chart.render();
					}
				}
			});
			
			chart.render();
		},
		
		render : function(){	
			var template = _.template(t_visualchart.innerHTML);
			this.$el.html(template);	
		}	
	});

	/* 
	 Server model
	 */
	 
	 var ServerRequestModel = Backbone.Model.extend({
		 
		 url : '/server_stat',
		 
		 defaults : {
			serverid : 0,
			serverstarttime : 0,
			serverendtime : 0,
			charttype : 'line'
		 }	 
	 });

	/* 
	 Server Request
	 */
	
	var ServerRequest = Backbone.View.extend({
		
		className : "container",
		
		events : {
			'click .submit' : 'onSubmitClick'
		},
		
		initialize : function(){
		  this.collection = new Backbone.Collection();
		  this.model = new ServerRequestModel();
		  this.render();  
		  
		  // do delay after render (_.defer for delay default is 100 miliseconds) and (_.bind binding function)
		  _.defer(_.bind(function(){
			  var visualChartModel = new VisualChartModel();
			  this.renderDatepicker(visualChartModel);
			  this.renderConfiguartionForm(visualChartModel);
			  this.renderVisualChart();
		  },this),1000)
		},		
		
		renderVisualChart : function(model){
			var visualChartView = new VisualChartView({model : model,collection : this.collection});
			visualChartView.$el.prepend("<h1>Visual Chart</h1>");
			this.$('.visual-editor').html(visualChartView.$el);
		},
		
		renderConfiguartionForm : function(model){
			var visualChartConfigurationView = new VisualChartConfigurationView({model : model});
			this.$('.configuration').append(visualChartConfigurationView.$el);
		},
		
		// Make pairs of the date (datepair.js)
		renderDatepicker : function(){
			this.$('#serverRequest .date').datepicker({
				'format': 'yyyy-m-d',
				'autoclose': true
		    });
			
			var form = this.$('#serverRequest');
		    var serverRequestDatepair = new Datepair(form[0]);
		},
		
		onSubmitClick : function(event) {
			event && event.preventDefault();
			
			var _this = this;			
			var changedAttributes = {};
			
			$.each($('#serverRequest').serializeArray(), function(i, field) {
				changedAttributes[field.name] = field.value;
			});		
			
			this.collection.reset();
			
			this.model.save(changedAttributes,{
				success : function(data){
					var data = _this.model.get('data');
					_.each(data.items,function(item, key){
						var model = new Backbone.Model(item);
						_this.collection.add(model);
					});
				
					this.$('.configuration, .visual-editor').removeClass('hide');
					
					app.trigger('show:visualchart');
				},
				error : function(){	
					alert('There is some error to save this model');
				}
			},this)
		},
		
		render : function(){	
			var template = _.template(t_serverRequest.innerHTML);
			this.$el.html(template);	
		}	
	})


var App = new ServerRequest();
$('body').append(App.$el);

}); 