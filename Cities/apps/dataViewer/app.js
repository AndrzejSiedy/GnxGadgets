Ext.Loader.setConfig({
	enabled:true
});


//The actual app
Ext.Loader.setPath('Gnx', 'apps/dataViewer');

var __extjs__ = '5.0.0';
var __localhost__ = 'http://localhost/';

//ExtJs extensions
Ext.Loader.setPath('Ext.ux', __localhost__ + 'jslibs/ExtJs/' + __extjs__ + '/examples/ux');


Ext.require([
	'Gnx.AppLogic'
]);

Ext.application({
	name: 'gnx',
	launch: function () {

	    Ext.QuickTips.init();
	    Ext.create('Gnx.AppLogic');

	}
});