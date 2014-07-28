/**
 * @author andre <andrzej.siedy@geonetix.pl>
 * @docauthor andre <andrzej.siedy@geonetix.pl>
 */
Ext.define('Gnx.data.model.CityFields', {
 	singleton: true,
 	fields: [
        {name: 'ID', type: 'number', defaultValue: 0, useNull: true},
        {name: 'Name', type: 'string', defaultValue: null, useNull: true},
        {name: 'AsciiName', type: 'string', defaultValue: null, useNull: true},
        {name: 'Lat', type: 'number', defaultValue: false, useNull: true},
        {name: 'Lon', type: 'number', defaultValue: false, useNull: true},
        {name: 'CountryCode', type: 'string', defaultValue: null, useNull: true},
        {name: 'Population', type: 'number', defaultValue: null, useNull: true},
        {name: 'Timezone', type: 'string', defaultValue: null, useNull: true}
    ]
 });
 
Ext.define('Gnx.data.model.City', {
    
    requires: [
    	'Gnx.data.model.CityFields'
    ],
    
    extend: 'Ext.data.Model',
    
    fields: Gnx.data.model.CityFields.fields,
    config: {
        fields: Gnx.data.model.CityFields.fields
    }
    
});

