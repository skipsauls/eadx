({
    listener: null,
    callbacks: {},
    //callbacks: [],
    callback: null,
    
    pluralTypeMap: {
        'dashboard': 'dashboards',
        'dataset': 'datasets',
        'folder': 'folders',
        'lens': 'lenses',
        'template': 'templates'
    },
    
    setupMessageListener: function(component) {
        //console.warn('setupMessageListener');
        var self = this;
        var voiceProxyId = component.get('v.vf_voice_proxy_id');
        //console.warn('voiceProxyId: ', voiceProxyId);
        //var iframe = component.find(voiceProxyId).getElement();
        //var vf_voice_proxy = component.find(voiceProxyId).getElement();
        var iframe = document.getElementById(voiceProxyId);
        var vf_voice_proxy = document.getElementById(voiceProxyId);
        //console.warn('iframe: ', iframe);
        //console.warn('vf_voice_proxy: ', vf_voice_proxy);
        var vf_win = vf_voice_proxy.contentWindow;
        var uid = component.get("v.uid");
        
        /*
         * TBD - Handle multiple proxies better!
         */
        
        /*
        if (self.listener !== null && typeof self.listener !== "undefined") {
            window.removeEventListener("message", self.listener);
        }
        */
        
        var _event = null;
        var _lastEvent = null;
        
        function handleMessageWrapper() {
            if (_lastEvent === _event) {
                //console.warn('+++++++++++++++++++++++++++++++++++++++++ _lastEvent and _event are the same');
                //console.warn('+++++++++++++++++++++++++++++++++++++++++ _lastEvent: ', _lastEvent);
                //console.warn('+++++++++++++++++++++++++++++++++++++++++ _event: ', _event);
            } else {
                _lastEvent = _event;
	            //console.warn(':::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: voiceProxyHelper handleMessageWrapper - _event.timeStamp: ', _event.timeStamp, _event);
    	        self.handleMessage(component, _event);
            }
        }
        
        var origin = window.location.origin;
        var mySalesforceOrigin = origin.replace('lightning.force', 'my.salesforce');
        var originMap = {            
        };
        originMap[origin] = 1;
        originMap[mySalesforceOrigin] = 1;
            
        //console.warn('originMap: ', originMap);
        
        self.listener = function(event) {            
            //console.warn(':::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: voiceProxyHelper self.listener - event.timeStamp ', event.origin, event.timeStamp, event);
            
            if (originMap[event.origin] !== 1) {
	            self.handleMessage(component, event);                
            }
/*
            if (_event && (_event.timeStamp === event.timeStamp)) {
                //console.warn('111111111111111    event and _event timeStamps are the same');
                return;
            } else {
                //console.warn('222222222222222    event and _event timeStamps are different');
                _event = event;
                window.requestAnimationFrame(handleMessageWrapper);                
            }
*/            
            /*
            _event = event;
            window.requestAnimationFrame(handleMessageWrapper);                
            */
        };       
        
        window.addEventListener("message", self.listener, false);
        
        var uid = Date.now() + '_' + Math.round(Math.random() * 100000000);
        component.set("v.uid", uid);
        //console.warn('uid: ', uid);
        
        var url = "";
		var ltngUrl = component.get("v.ltngUrl") || window.location.origin;
        
        var baseUrl = component.get('v.baseUrl') || '/apex/voiceProxy';

        //console.warn('************************************************************ baseUrl: ', baseUrl);
        
        if (baseUrl === null || typeof baseUrl === 'undefined' || baseUrl === '') {
	        url = ltngUrl + baseUrl + '?ltng_origin=' + window.location.origin + '&ltng_url=' + ltngUrl + '&ltng_uid=' + uid;            
        } else {
	        url = baseUrl + '?ltng_origin=' + window.location.origin + '&ltng_url=' + ltngUrl + '&ltng_uid=' + uid;            
        }
        
        var queryParams = component.get('v.query_params');
        //console.warn(']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] queryParams: ', queryParams);
        if (queryParams !== null && typeof queryParams !== 'undefined') {
            queryParams = queryParams.replace('?', '&');
            queryParams += queryParams.charAt(0) !== '&' ? '&' : '';
            url += queryParams;
        }
        
		//var url = ltngUrl + '/apex/voiceProxy?ltng_origin=' + window.location.origin + '&ltng_url=' + ltngUrl + '&ltng_uid=' + uid;
        
        //var url = 'https://localhost.3001/voiceproxy?ltng_origin=' + window.location.origin + '&ltng_url=' + ltngUrl + '&ltng_uid=' + uid;
        
        //var url = 'https://analytics-ltngout-playground.herokuapp.com/voiceproxy?ltng_origin=' + window.location.origin + '&ltng_url=' + ltngUrl + '&ltng_uid=' + uid;
        
        //console.warn('************************************************************ url: ', url);
        
		component.set('v.vf_voice_proxy_url', url);
    },
        
    handleMessage: function(component, event) {
        if (event.data !== null && typeof event.data !== 'undefined') {
            var data = null;
            var self = this;
            try {
                data = JSON.parse(event.data);
    
                //console.warn('voiceProxyHelper.handleMessage - data.source: ', data.source, data);
                if (data) {
                    var uid = component.get("v.uid");
                    //console.warn('uid: ', data.uid);
                    var vf_origin_url = component.get("v.vf_origin_url");
                    //console.warn('data: ', data.type, data.uid);
                    if (data.type === "ready" && data.uid === uid) {
                        //console.warn('**************************************************************************** ready');
                        if (data.response) {
                            console.warn('voiceProxyHelper.handleMessage - ready response: ', data.response);
                        }
                        var origin_url = event.origin;
                        //console.warn('origin_url: ', origin_url);
                        component.set("v.vf_origin_url", origin_url);
                        component.set("v.ready", true);
                        
                    } else if (data.type === "response" && data.uid === uid && event.origin === vf_origin_url) {
                        var response = data.response;
                        
                        if (response.source !== 'AudioAnalyzer') {
                            //onsole.warn('voiceProxyHelper.handleMessage - response: ', response.phase, response);                            
                        }

    
                        // Named callbacks
                        var callback = self.callbacks[response.config.uid];
                        
                        if (typeof callback === 'function') {
    
                            function callbackWrapper() {
                                if (response.source !== 'AudioAnalyzer') {
                                    //console.warn('callbackWrapper calling callback with response: ', response);
                                }
                                callback(component, response);
                            }
                            window.requestAnimationFrame(callbackWrapper);
                            
                        } else {
                            console.error('no callback found for response.config.uid:', response.config.uid);
                            
                        }
                    } else {
                    }
                }
                
                
            } catch (e) {
                //console.error('error: ', e);
                if (event.data) {
                    var d = JSON.parse(JSON.stringify(event.data));
                    console.warn('d: ', d);
                }
            }
		}
    },
    
    sendMessage: function(component, type, config, callback) {
        var origin_url = component.get("v.vf_origin_url");
        //console.warn('sendMessage - origin_url: ', origin_url, typeof origin_ur);
        var uid = component.get("v.uid");
        var self = this;
        if (typeof origin_url !== "undefined") {
	        var voiceProxyId = component.get('v.vf_voice_proxy_id');
            //var vf_voice_proxy = component.find(voiceProxyId).getElement();
			var vf_voice_proxy = document.getElementById(voiceProxyId);            
            var vf_win = vf_voice_proxy.contentWindow;
            if (typeof callback === 'function') {
                
                // Named callbacks
                self.callbacks[config.uid] = callback;
                
                // Singular callback
                //self.callback = callback;
            }
            
            var json = JSON.stringify({type: type, uid: uid, config: config});
            //console.warn('sendMessage sending json: ', json);
            vf_win.postMessage(json, origin_url);
        }
    }
})