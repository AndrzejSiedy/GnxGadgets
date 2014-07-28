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


    },

    onGridDataLoaded: function (data) {
        this.createFeatures(data);
    },


    getCities: function (start, limit) {

        //start = start ? start : 0;
        //limit = limit ? limit : 50;


        //Ext.Ajax.request({

        //    // because we have enabled CORS on web services (WebApi)
        //    // we can call for data without proxy
        //    // proxy used here is using Cartomatic.Utils.Http
        //    // proxies/xDomainProxy.ashx?url=
        //    url: 'http://localhost/WebApi/api/city/GetCitiesPaging?start=' + start + '&limit=' + limit,
        //    method: 'GET',
        //    //headers: {
        //    //    'Content-Type': 'application/json; charset=utf-8'
        //    //},
        //    //params: Ext.JSON.encode({
        //    //    start: 0,
        //    //    limit: 2000
        //    //}),
        //    success: Ext.bind(this.getCitiesCallbackSuccess, this),
        //    failure: Ext.bind(this.getCitiesCallbackFailure, this)
        //});
    },

    getCitiesCallbackSuccess: function (response) {

        var resp = Ext.JSON.decode(response.responseText);

        var total = resp.total
        var records = resp.records

        console.warn('got ', records.length, ' out of ', total);

        this.createFeatures(resp.records);
        
    },

    getCitiesCallbackFailure: function (response) {
        console.warn('getCitiesCallbackFailure', response);
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