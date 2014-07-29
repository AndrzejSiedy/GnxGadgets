ShindigUtils = {

    publish: function(evtName, data) {
        if (typeof gadgets != "undefined") {
            gadgets.Hub.publish(evtName, data);
        }
    },

    subscribe: function(evtName, callback) {
        if (typeof gadgets != "undefined") {
            gadgets.Hub.subscribe(evtName, callback);
        }
    }

};
