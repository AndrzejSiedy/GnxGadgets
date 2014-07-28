Ext.Loader.setConfig({
    enabled: true
});

// NOTE: important to give valid not relative path - it has to be available online
// as when rendered by OpenSocial Container it will get it's url
//The actual app
Ext.Loader.setPath('Gnx', location.href + 'apps/map');

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

        //function callback(topic, data, subscriberData) {
        //    console.warn('message', topic, data, subscriberData)
        //}

        //function subscribe() {
        //    subId = gadgets.Hub.subscribe("org.apache.shindig.random-number", callback);
        //    console.warn('evt subscribed');
        //}

        //function unsubscribe() {
        //    gadgets.Hub.unsubscribe(subId);
        //    document.getElementById("output").innerHTML = "";
        //}

        //subscribe();
        Ext.QuickTips.init();
        Ext.create('Gnx.AppLogic');

    }
});

