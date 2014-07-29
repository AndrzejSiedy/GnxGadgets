Ext.define('Gnx.map.Map', {

    mixins: {
        observable: 'Ext.util.Observable'
    },

    layers: null,

    // highlighted feature
    highlight: null,

    selectedFeatures: [],
    /**
     * Creates a new instance
     * @param {Object} config
     * 
     */
    constructor: function (config) {

        Ext.apply(this, config);
        this.mixins.observable.constructor.call(this, config);
        this.callParent([config]);


        if (!this.layers) {
            this.layers = {};
            this.layersArr = [];
        }


        // create set of predefined layers
        this.createLayers();

        this.createMap();

        this.loadLayers();

        this.addHighlightFeatureOverlay();
        this.addSelectFeatureOverlay();

        this.bindMapEvts();


        // bind to SignalR pushed evts
        // bind to an event after hub start
        // NOTE: There MUST be at least one callback registered before start
        //chat.on('onGridDataSelectionChange', Ext.bind(this.onGridDataSelectionChange, this));
        
    },

    createLayers: function () {

        var mapQuest = new ol.layer.Tile({
            source: new ol.source.MapQuest({ layer: 'sat' })
        });
        this.layers['mapQuest'] = mapQuest;
        this.layersArr.push(mapQuest);



        var serviceVectorLayer = new ol.layer.Vector({
            source:  new ol.source.GeoJSON({
                //projection: 'EPSG:4326'
                projection: 'EPSG:3857'
                //text: data
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        this.layers['serviceVectorLayer'] = serviceVectorLayer;
        this.layersArr.push(serviceVectorLayer);

    },

    createMap: function (mapDivId) {
     
        this.map = new ol.Map({
            renderer: 'canvas',
            target: mapDivId ? mapDivId : null, 
            view: new ol.View({
                //projection: 'EPSG:4326',
                //projection: 'EPSG:3857',
                center: [0, 0],
                zoom: 2
            })
        });

        // dev only
        map = this.map;

    },

    /**
    * Add feature overlay instance, this is used to show highlighted "on mouse over" feature
    */
    addHighlightFeatureOverlay: function () {
        // feature overlay is used to highlight features
        this.highlightFeatureOverlay = new ol.FeatureOverlay({
            map: this.map,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'red',
                    opacity: 0.6
                }),
                stroke: new ol.style.Stroke({
                    color: 'red',
                    opacity: 1,
                    width: 1
                }),
                image: new ol.style.Circle({
                    opacity: 0.6,
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'blue'
                    })
                })
            })
        });
    },

    addSelectFeatureOverlay: function(){
        // feature overlay is used to highlight features
        this.selectFeatureOverlay = new ol.FeatureOverlay({
            map: this.map,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'green',
                    opacity: 0.6
                }),
                stroke: new ol.style.Stroke({
                    color: 'green',
                    opacity: 1,
                    width: 1
                }),
                image: new ol.style.Circle({
                    opacity: 0.6,
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'green'
                    })
                })
            })
        });
    },

    loadLayers: function () {

        if (this.map && this.layers) {
            for (var l in this.layers) {
                this.map.addLayer(this.layers[l]);
            }


            var sl = this.layers['serviceVectorLayer'];

            var me = this;
            sl.on('change', function (e) {
                me.map.getView().fitExtent(sl.getSource().getExtent(), me.map.getSize());
            });
        }

    },


    setTarget: function (targetDiv) {
        this.targetDiv = targetDiv;

        if (this.map) {
            this.map.setTarget(targetDiv);
        }

    },

    loadFeatures: function(features, deleteOld){

        var source = this.layers['serviceVectorLayer'].getSource();
        if (deleteOld) {
            this.clearSelectedFeatures();
            this.clearHighlightedFeatures();
            source.clear();
        }
        source.addFeatures(features);

    },

    onGridDataSelectionChange: function (data) {

        if (!data) return;
        if (!Ext.isArray(data)) {
            data = [data];
        }
        else {
            if (data.length == 0) return;
        }


        // list of IDs - will find all features containing ID from list "ids"
        var ids = [];
        for (var i = 0; i < data.length; i++) {
            ids.push(data[i].ID);
        }

        // find features
        var source = this.layers['serviceVectorLayer'].getSource();
        var features = source.getFeatures();
        
        var features4Selection = [];

        // this is manually created filter flow, we test custom data assigned to the feature properties
        for (var i = 0; i < features.length; i++) {
            var f = features[i];
            if (Ext.Array.indexOf(ids, f.getProperties().data['ID']) > -1) {
                features4Selection.push(f);
            }
        }

        // clear selection
        this.clearSelectedFeatures()
        for (var i = 0; i < features4Selection.length; i++) {
            var f = features4Selection[i];
            this.selectedFeatures.push(f)
            this.selectFeatureOverlay.addFeature(f);
        }

    },

    clearSelectedFeatures: function(){
        for (var i = 0; i < this.selectedFeatures.length; i++) {
            var f = this.selectedFeatures[i];
            this.selectFeatureOverlay.removeFeature(f);
        }
        this.selectedFeatures = [];
    },

    clearHighlightedFeatures: function(){
        if (!this.highlight) return;
        this.highlightFeatureOverlay.removeFeature(this.highlight);
    },

    getFeatureFromPixed: function(pixel){
        var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            return feature;
        });

        return feature;
    },

    highlightFeature: function(feature) {
        
        

        if (feature !== this.highlight) {
            if (this.highlight) {
                this.highlightFeatureOverlay.removeFeature(this.highlight);
            }
            if (feature) {
                this.highlightFeatureOverlay.addFeature(feature);

                // NOTE:
                // When feature is created we set extra property "data" to keep initiall data
                // f.getProperties().data
               
                // call SignalR service method, which will push notification to other clients in the group
                //chat.server.featureHighlighted(_roomId_, feature.getProperties().data);

                this.fireEvent('featureHighlighted', feature.getProperties().data);

            }
            this.highlight = feature;

        }

    },

    bindMapEvts: function () {

        var me = this;
        $(this.map.getViewport()).on('mousemove', function (evt) {
            var pixel = me.map.getEventPixel(evt.originalEvent);
            me.highlightFeature(me.getFeatureFromPixed(pixel));
        });

        this.map.on('singleclick', function (evt) {
            me.highlightFeature(me.getFeatureFromPixed(evt.pixel));
        });

    }



});