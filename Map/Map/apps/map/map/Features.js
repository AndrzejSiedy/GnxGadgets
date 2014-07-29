Ext.define('Gnx.map.Features', {

    mixins: {
        observable: 'Ext.util.Observable'
    },


    /**
     * Creates a new instance
     * @param {Object} config
     * 
     */
    constructor: function (config) {

        Ext.apply(this, config);
        this.mixins.observable.constructor.call(this, config);
        this.callParent([config]);

        // bind to an event after hub start
        // NOTE: There MUST be at least one callback registered before start
        //chat.on('onGridDataLoaded', Ext.bind(this.onGridDataLoaded, this));

        //ShindigUtils.subscribe('gnx.shindig.cities.loaded', Ext.bind(this.onGridDataLoaded, this));
        
    },

    onGridDataLoaded: function (evtName, data) {
        this.createFeatures(data);
    },

    createFeatures: function (data) {

        //var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');

        var len = data.length;
        var i = 0;
        var features = []

        
        for (i; i < len; i++) {

            var f = new ol.Feature({ data: data[i] }); // so we can easyly get our data back f.getProperties().data
            //var f = new ol.Feature(data[i]); // copy all data to the feature, so they are accessible using f.getProperties()

            // transform coordinates from 4326 to what ever and create geometry
            f.setGeometry(new ol.geom.Point(ol.proj.transform([data[i].Lon, data[i].Lat], 'EPSG:4326', 'EPSG:3857')))

            features.push(f)

        }

        this.fireEvent('featuresReady', features, this);

    }

});