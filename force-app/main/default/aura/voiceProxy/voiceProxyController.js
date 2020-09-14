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
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {                    
                    callback(response);
                }
            });
        }        
    },
    
	getVoices: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var config = {
                uid: params.uid
            };
            
            helper.sendMessage(component, "getVoices", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response.voices || null);
                }
            });
        }
	},
    
	loadSounds: function(component, event, helper) {
        console.warn('voiceProxyController.loadSounds');
		var params = event.getParam('arguments');
        console.warn('params: ', params);
        if (params) {
            var config = {
                resources: params.resources || {},
                uid: params.uid
            };
            console.warn('config: ', config);
            helper.sendMessage(component, "loadSounds", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},

	playSound: function(component, event, helper) {
        //console.warn('voiceProxyController.playSound');
		var params = event.getParam('arguments');
        //console.warn('params: ', params);
        if (params) {
            var config = {
                name: params.name,
                uid: params.uid
            };
            //console.warn('config: ', config);
            helper.sendMessage(component, "playSound", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},

	stopSound: function(component, event, helper) {
        //console.warn('voiceProxyController.stopSound');
		var params = event.getParam('arguments');
        //console.warn('params: ', params);
        if (params) {
            var config = {
                name: params.name,
                uid: params.uid
            };
            //console.warn('config: ', config);
            helper.sendMessage(component, "stopSound", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},
    
	speak: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var config = {
                phrase: params.phrase,
                voice: params.voice || 'Alex',
                volume: params.volume || 1.0,
                rate: params.rate || 1.0,
                pitch: params.pitch || 1.0,
                uid: params.uid
            };
            
            helper.sendMessage(component, "speak", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},
    
	startDictation: function(component, event, helper) {
        //console.warn('voiceProxyController.startDictation');
		var params = event.getParam('arguments');
        if (params) {
            var config = {
                lang: params.lang || 'en-US',
                continuous: params.continuous || false,
                interimResults: params.interimResults || false,
                maxAlternatives: params.maxAlternatives || 1,
                uid: params.uid
            }

            helper.sendMessage(component, "startDictation", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {                    
                    callback(response);
                }
            });
        }
	},
    
	stopDictation: function(component, event, helper) {
        //console.warn('voiceProxyController.stopDictation');
		var params = event.getParam('arguments');
        var callback = params.callback;
        var config = {
            uid: params.uid
        }        
        helper.sendMessage(component, "stopDictation", config, function(cmp, response) {
            //console.warn('voiceProxyController.stopDictation received response: ', response);
            if (typeof callback === 'function') {
	            //console.warn('voiceProxyController.stopDictation sending response: ', response);
                callback(response);
            }
        });
	},

	startAnalysis: function(component, event, helper) {
        console.warn('voiceProxyController.startAnalysis');
		var params = event.getParam('arguments');
        var callback = params.callback;
        var config = {
            uid: params.uid
        }        
        helper.sendMessage(component, "startAnalysis", config, function(cmp, response) {
            console.warn('voiceProxyController.startAnalysis received response: ', response);
            if (typeof callback === 'function') {
                callback(response);
            }
        });
	},
    
	stopAnalysis: function(component, event, helper) {
        console.warn('voiceProxyController.stopAnalysis');
		var params = event.getParam('arguments');
        var callback = params.callback;
        var config = {
            uid: params.uid
        }        
        helper.sendMessage(component, "stopAnalysis", config, function(cmp, response) {
            console.warn('voiceProxyController.stopAnalysis received response: ', response);
            if (typeof callback === 'function') {
                callback(response);
            }
        });
	},
    
    getByteTimeDomainData: function(component, event, helper) {
        //console.warn('voiceProxyController.getByteTimeDomainData');
		var params = event.getParam('arguments');
        var callback = params.callback;
        var config = {
            visualSetting: params.visualSetting || null,
            uid: params.uid
        }
        helper.sendMessage(component, "getByteTimeDomainData", config, function(cmp, response) {
            //console.warn('voiceProxyController.getByteTimeDomainData received response: ', response);
            if (typeof callback === 'function') {
                callback(response);
            }
        });
    }
    
})