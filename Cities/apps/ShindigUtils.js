ShindigUtils = {

    publish: function (evtName, data) {
        if (typeof gadgets != "undefined") {
            gadgets.Hub.publish(evtName, data);
        }
    },

    subscribe: function (evtName, callback) {
        if (typeof gadgets != "undefined") {
            gadgets.Hub.subscribe(evtName, callback);
        }
    },

    version: function () {
        return {
            version: '0.0.1'
        }
    }
};

ShindigUtils.version();
