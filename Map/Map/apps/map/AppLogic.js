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
						    html: '<div id=' + mapDivId + ' style="width:100%;height:100%;"></div>'
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
	                }, 100, this);

	            }
	        }
	    });

	    view.on('resize', function () {
	        me.mapMod.map.updateSize();
	    });

	    //this.getCities();

	},

	mapReady: function(){
	    this.featuresMod.getCities(start = 0, limit = 50);
	},

	onFeaturesReady: function(features){
	    this.mapMod.loadFeatures(features = features, deleteOld = true);
	},
	
    // dev method - show some text
	getLoremIpsum: function(){
		return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
	}
	
});