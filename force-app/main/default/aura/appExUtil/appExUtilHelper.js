({
    setup: function(component) {
        var self = this;
        
        self.getAppExchangeListings(component, function(response) {
            console.warn('listings: ', response);
        });
    },
    
    getAppExchangeListings: function(component, callback) {
        console.warn('getAppExchangeListings');        
        var action = component.get("c.listApps");
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                var obj = JSON.parse(JSON.parse(val));
                var listings = obj.data;
                console.warn('listings: ', listings);
                component.set('v.listings', listings);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action)        
    },
    
    _getAppExchangeListings: function(component, callback) {
        console.warn('getAppExchangeListings');
        var proxy = component.find('proxy');        
        var self = this;
        var url = 'https://api.appexchange.salesforce.com/services/apexrest/v1/listings?type=components&filter=8&lang=en_US';
        var method = 'GET';
        
        var ready = proxy.get('v.ready');
        var self = this;
        if (ready === false) {
            setTimeout(function() {
                self.getAppExchangeListings(component, callback);
            }, 200);
        } else {        
            proxy.exec(url, method, {}, function(response) {
                response = JSON.parse(JSON.stringify(response));
                if (response) {
                    if (typeof callback === 'function') {
                        callback(response);
                    }
                }
            });
        }
    } 
    
})