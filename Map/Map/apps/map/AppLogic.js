/**
 * @class
 */
Ext.define('Gnx.AppLogic', {
	
    requires: [
        'Gnx.data.model.City',
        'Gnx.map.Features',
        'Gnx.map.Map'
	],
	
	constructor: function(){

	    Ext.getBody().on("contextmenu", Ext.emptyFn, null, { preventDefault: true });


	    this.mapMod = Ext.create('Gnx.map.Map');
	    this.featuresMod = Ext.create('Gnx.map.Features');

	    this.featuresMod.on('featuresReady', this.onFeaturesReady, this);


        // map div id
	    var mapDivId = Ext.id();

	    var me = this;

	    var view = Ext.create('Ext.container.Viewport', {
	        layout: 'border',
	        items: [
				{
				    xtype: 'container',
				    region: 'center',
				    layout: 'fit',
				    items: [
						{
						    xtype: 'container',
						    layout: 'fit',
						    html: '<div id=' + mapDivId + ' style="width:100%;height:100%;">' +
                                        '<div id="popup" class="ol-popup">' +
                                            '<a href="#" id="popup-closer" class="ol-popup-closer"></a>' +
                                        '<div id="popup-content"></div>' +
                                '</div></div>'
						}
				    ]
				}
	        ],
	        listeners: {
	            render: function (component, eOpts) {
	                // set map target
                    // we need this delay to make sure map container has been properly rendered
	                Ext.defer(function () {
	                    me.mapMod.setTarget(mapDivId)
	                    me.mapReady();
	                }, 1, this);

	            }
	        }
	    });

	    view.on('resize', function () {
	        me.mapMod.map.updateSize();
	    });

	    this.mapMod.on('featureHighlighted', this.onFeatureHighlighted, this);

	    ShindigUtils.subscribe("gnx.shindig.cities.selected", Ext.bind(this.onCitiesSelected, this));
	    ShindigUtils.subscribe("gnx.shindig.cities.loaded", Ext.bind(this.featuresRecived, this));
	    
	},

	loadWeather: function(location, woeid) {
	    $.simpleWeather({
	        location: location,
	        woeid: woeid,
	        unit: 'c',
	        success: function (weather) {
	            var html = '';
	            //html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
	            html += '<h2><img src="' + weather.thumbnail + '"/>' + weather.temp + '&deg; ' + weather.units.temp + '</h2>';
	            html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
	            html += '<li class="currently">'+weather.currently+'</li>';
	            html += '<li>'+weather.alt.temp+'&deg;C</li>';
	            html += '</ul>';
                    
      
	            //$("#weather").html(html);
	            Ext.create('Ext.window.Window', {
                    autoScroll: true,
	                width: 200,
	                height: 200,
	                html: html
	            }).show();


	        },
	        error: function(error) {
	            $("#weather").html('<p>'+error+'</p>');
	        }
	    });
	},

	onFeatureHighlighted: function (data) {
	    ShindigUtils.publish("gnx.shindig.cities.highlighed", data);
	    this.loadWeather(data.Lat + ',' + data.Lon);
	},

	featuresRecived: function (evtName, data) {
	    this.featuresMod.createFeatures(data.data);
	},

	onCitiesSelected: function(evtName, data){
	    console.warn('onCitiesSelected', arguments);
	    this.mapMod.onGridDataSelectionChange(data.data)
	},

	mapReady: function(){
	},

	onFeaturesReady: function(features){
	    this.mapMod.loadFeatures(features = features, deleteOld = true);
	},
	
    // dev method - show some text
	getLoremIpsum: function(){
		return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
	}
	
});