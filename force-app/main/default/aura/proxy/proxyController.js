({
    getRelativeUrl: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var url = params.url;
            
            var xhrConfig = {
                url: url,
                method: "GET"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
    },
    
    exec: function(component, event, helper) {
        //console.warn('proxyController.exec');
        var params = event.getParam('arguments');
        if (params) {
            var url = params.url;
            var method = params.method;
            var body = params.body;
            
            var xhrConfig = {
                url: url,
                method: method,
                body: body
            };
            
            console.warn('proxyController.exec - xhrConfig: ', xhrConfig);
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {                    
                    callback(response);
                }
            });
        }        
    },
    
    listAssets: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var type = params.type;
            
            var xhrConfig = {
                url: "/services/data/v46.0/wave/" + type,
                method: "GET"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {                    
                    callback(response);
                }
            });
        }
    },
    
    getAsset: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var type = params.type;
            var id = params.id;
            
            var xhrConfig = {
                url: "/services/data/v46.0/wave/" + type + "/" + id,
                method: "GET"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
    },
    
    getAssetHistory: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var url = params.historyUrl;
            
            var xhrConfig = {
                url: url,
                method: "GET"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    var histories = response.body.histories;
                    callback(histories);
                }
            });
        }
    },
    
    deleteAssetHistory: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var url = params.historyUrl;
            
            var xhrConfig = {
                url: url,
                method: "DELETE"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
    },
    
    revertAssetHistory: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var url = params.revertUrl;
            var historyId = params.historyId;
            var historyLabel = params.historyLabel;
            
            var config = {
                historyId: historyId,
                historyLabel: historyLabel
            };
            
            var body = JSON.stringify(config);
            
            var xhrConfig = {
                url: url,
                method: "PUT",
                body: body
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
    },
    
    
    handshake: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var config = {
                type: "handshake",
                preserveCallback: true	// Same callback is reused
            };
            config.logLevel = params.logLevel || undefined;
            
			helper.sendMessage(component, "handshake", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
    },
    
    subscribe: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var topic = params.topic;
            
            var config = {
                type: "subscribe",
                topic: topic,
                preserveCallback: true	// Same callback is reused
            };
            
            helper.sendMessage(component, "subscribe", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
    },
    
    unsubscribe: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            var topic = params.topic;
            
            var config = {
                type: "unsubscribe",
                topic: topic
            };
            
            helper.sendMessage(component, "unsubscribe", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
    }
    
})