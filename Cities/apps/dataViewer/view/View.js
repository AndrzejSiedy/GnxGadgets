Ext.define('Gnx.view.View', {

    requires: [
            'Gnx.data.model.City',
            'Ext.PagingToolbar'
    ],

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

        this.setup();

    },

    onFeatureHighlighted: function(data){
        //console.warn('select feature on store', data);
        var recIdx = this.store.find('ID', data.ID);
        if (recIdx > -1) {
            this.view.view.focusRow(recIdx);
        }
    },

    setup: function () {

        this.store = Ext.create('Ext.data.Store', {
            pageSize: 50,
            autoLoad: true,
            model: 'Gnx.data.model.City',
            proxy: {
                type: 'ajax',
                url: 'http://localhost:3962/api/city/GetCitiesPaging',
                reader: {
                    root: 'records',
                    totalProperty: 'total'
                },
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    "Accept": "application/json" // REQUIRED for FF in order to do proper JSON reuqest
                },
            }
        });

        // bind to store events
        this.bindStoreEvts();


        this.view = Ext.create('Ext.grid.Panel', {
            height: '100%',
            width: '100%',
            title: 'Cities from GeoNames',
            selModel: {
                mode: 'MULTI'
            },
            store: this.store,
            loadMask: true,
            // grid columns
            columns:[{
                id: 'ID',
                text: "ID",
                dataIndex: 'ID',
                width: 50
            },{
                text: "Name",
                dataIndex: 'Name',
                sortable: true,
                flex: 1,
                filter: {
                    type: 'string'
                    // specify disabled to disable the filter menu
                    //, disabled: true
                }
            },{
                text: "AsciiName",
                dataIndex: 'AsciiName',
                align: 'right',
                sortable: true,
                flex: 1
            },{
                id: 'Lat',
                text: "Lat",
                dataIndex: 'Lat',
                sortable: true,
                flex: 1
            }, {
                id: 'Lon',
                text: "Lon",
                dataIndex: 'Lon',
                sortable: true,
                flex: 1
            }],
            // paging bar on the bottom
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.store,
                displayInfo: true,
                displayMsg: 'Displaying topics {0} - {1} of {2}',
                emptyMsg: "No topics to display"
            })
        });

        this.binGridEvts();

    },

    binGridEvts: function () {

        this.view.on('selectionchange', this.onSelectionChange, this);
    },

    onSelectionChange: function (grid, selected, eOptss) {

        var sel = [];
        for (var i = 0; i < selected.length; i++) {
            sel.push(selected[i].getData());
        }

    },

    onItemMouseEnter: function(grid, record, item, index, e, eOpts){
        console.warn('itemmouseenter', record);
    },

    bindStoreEvts: function () {

        // load
        this.store.on('load', this.onStoreLoad, this);

        // removeAll
        this.store.on('clear', this.onStoreRemoveAll, this);

        // remove
        this.store.on('remove', this.onStoreRemove, this);
    },

    onStoreLoad: function (store, records, successful, eOpts) {

        if (!records || records.length == 0) return;

        var rawData = [];
        for (var i = 0; i < records.length; i++) {
            rawData.push(records[i].getData());
        }

    },

    onStoreRemoveAll: function (store, eOpts) {
        console.warn('onStoreRemoveAll');
    },

    onStoreRemove: function (store, record, index, isMove, eOpts ) {
        console.warn('onStoreRemove');
    }


});