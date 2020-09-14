({
    test: function(component, event, helper) {
        var params = event.getParam('arguments');
        var callback = params.callback;
        
        if (typeof callback === 'function') {
            callback(null, 'Hello, World - ' + Date.now());
        }
    },
    
    testRemote: function(component, event, helper) {
        var params = event.getParam('arguments');
        var callback = params ? params.callback : null;
        var action = component.get("c.foo");
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                if (typeof callback === 'function') {
                    callback(null, val);
                }                
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                    if (typeof callback === 'function') {
                        callback(errors[0].message, null);
                    }                
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);
    },
    
    testXHR: function(component, event, helper) {
        
        var params = event.getParam('arguments');
        console.warn('params: ', params);
        var callback = params ? params.callback : null;
        var sessionId = params ? params.sessionId : null;
		console.warn('sessionId, ', sessionId);
		console.warn('callback, ', callback);

        var req = null;
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        console.warn('req: ', req);
        
        var url = 'https://adx-dev-ed.my.salesforce.com/services/data/v46.0/wave/dashboards';
        
        var config = {
            url: url,
            method: "GET"
        };
                
        req.onreadystatechange = function() {
            
            console.warn('req.readyState: ', req.readyState);
            
            if (req.readyState != 4) {
                return;
            }
            
            var response = {};
            
            console.warn('req.status: ', req.status);
            
            if (req.status < 200 || req.status > 299) {
                response = {
                    status: req.status,
                    statusText: req.statusText,
                    body: req.response,
                    type: req.responseType,                    
                    headers: req.getAllResponseHeaders(),
                    config: config
                };
            } else {                
                response = {
                    status: req.status,
                    statusText: req.statusText,
                    body: req.response,
                    type: req.responseType,
                    headers: req.getAllResponseHeaders(),
                    config: config
                };
            }
            
            if (req.responseType === "xml") {
                response.xml = req.responseXML;
            }
            
            var json = JSON.stringify(response);
            console.warn('response json - ', json);
        }
        
        console.warn('proxy - config.url: ', config.url);

        req.open(config.method, config.url, true);
        
        console.warn('setting header for session ID: ', sessionId);
        
        req.setRequestHeader("Authorization", 'Bearer ' + sessionId);
        
        /*        
        if (config.url.indexOf("http") < 0) {
            console.warn('NOT USING PROXY');
            req.open(config.method, config.url, true);
            // Set the Authorization header for local calls
            req.setRequestHeader("Authorization", 'Bearer {!$Api.Session_ID}');
            
        } else {
            console.warn('USING PROXY');
            // Use the proxy
            //req.open(config.method, UserContext.siteUrlPrefix + "/services/proxy", true);
            
            req.open(config.method, "https://adx-dev-ed.my.salesforce.com/services/proxy", true);
            
            // Set the endpoint accordingly for using the proxy
            req.setRequestHeader("SalesforceProxy-Endpoint", config.url);

            req.setRequestHeader("Authorization", 'Bearer {!$Api.Session_ID}');
            
        }
*/

        if (config.headers) {
            for (var key in config.headers) {
                req.setRequestHeader(key, config.headers[key]);
            }
        }
        
        // Not necessary when using proxy?
        //req.setRequestHeader("Access-Control-Allow-Origin", "*");
        

        req.setRequestHeader("Content-Type", "application/json");

        req.setRequestHeader("Accept", config.responseType || "application/json");
        
        if (config.method !== "POST") {
            req.responseType = config.responseType || "json";
        }
            
        
        req.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
        req.setRequestHeader('cache-control', 'max-age=0');
        req.setRequestHeader('expires', '0');
        req.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
        req.setRequestHeader('pragma', 'no-cache');
        
        if (config.body ) {
            console.warn('vfproxy POSTING config.body: ', config.body);
            req.send(config.body);
        } else {
            console.warn('calling req.send');
            req.send();
        }
        
    }

})