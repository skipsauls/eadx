({
    doWork: function(component) {
        var self = this;
        var timestamp = component.get("v.timestamp");
        var interval = parseInt(component.get("v.delay"));
        if (Date.now() >= timestamp + interval) {
            
            var target = component.get("v.target");
            self.updateSelection(component, true, target);
            //self.updateLimits(component);
            
            component.set("v.timestamp", Date.now());            
        }
        
        var globalId = requestAnimationFrame($A.getCallback(function() {
            self.doWork(component);
        }));
        
        component.set("v.globalId", globalId);        
    },
    
	start: function(component) {
        var self = this;
        var target = component.get("v.target");
        self.updateSelection(component, true, target);
        //self.updateLimits(component);
        component.set("v.timestamp", Date.now());
        
        var globalId = requestAnimationFrame($A.getCallback(function() {
            self.doWork(component);
        }));
        
        component.set("v.globalId", globalId);
        component.set("v.started", true); 
	},
    
    stop: function(component) {
        var globalId = component.get("v.globalId");
        cancelAnimationFrame(globalId);
        component.set("v.started", false);
    },    
    
	fireEvent: function(component) {
        var started = component.get("v.started");
        if (started === false) {
            return;
        }

		var type = component.get("v.type");
		var target = component.get("v.target");
		var payload = component.get("v.payload");
        
        /*
        console.warn('eaPlatformEventTesterController.handleFire');
        console.warn('type: ', type);
        console.warn('target: ', target);
        console.warn('payload: ', payload);
        */
        
        var action = component.get("c.fireEvent");
        action.setParams({type: type, target: target, payload: payload});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                //console.warn('val: ', val);                
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
        $A.enqueueAction(action);        
	},
    
    handlePlatformEvent: function(component, event) {
        var started = component.get("v.started");
        if (started === false) {
            return;
        }        
        var p = event.getParam('payload');
       	//console.warn('twitterLiveHelper.handlePlatformEvent: ', p);
        var type = p.df17eadx__type__c;
        var target = p.df17eadx__target__c;
        var payload = p.df17eadx__payload__c;
        
        /*
        console.warn('type: ', type);
        console.warn('target: ', target);
        console.warn('payload: ', payload);
    	*/
        
        this.updateSelection(component, true, target);
    },
    
    // Forces dashboard to redraw
    updateSelection: function(component, init, target) {
        // Use A/B switching
        var fieldSwitch = component.get("v.fieldSwitch");
        var values = null;
        if (fieldSwitch === 'A') {
			values = [component.get("v.fieldValue")];
            fieldSwitch = 'B';
        } else {
            values = [null];
            fieldSwitch = 'A';
        }
        component.set("v.fieldSwitch", fieldSwitch);
        
        //console.warn('values: ', values);
        
        // OLD ATTEMPT
        //var values = init === true ? [component.get('v.fieldValue')] : [null];
        //

        var self = this;
        var selection = {
            datasets: {}
		};
 
        
 		selection.datasets[component.get("v.datasetName")] = [
	    	{
        		fields: [component.get('v.fieldName')],
        		selection: values
    		}
		];
    	

        //console.warn('selection: ', selection);
        
		var json = JSON.stringify(selection);
        
        console.warn('json: ', json);
        
        var dashboardId = target;
        var evt = $A.get('e.wave:update');
        var params = {
            value: json,
            id: dashboardId,
            type: "dashboard"
        };
        evt.setParams(params);
        evt.fire();
        
        /*
         * OLD ATTEMPT
        if (init === true) {
            setTimeout($A.getCallback(function() {
                self.updateSelection(component, false, target)
            }, 1000));
        }
        */
    },
    
    updateLimits: function(component) {
        var action = component.get("c.getAppRateLimit");
        var resources = 'search,statuses';
        action.setParams({resources: resources});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var limits = JSON.parse(response.getReturnValue());
                console.warn('limits: ', limits);
                
                return;
                
                
                var resources = limits.resources;
                var limit = null;
                var items = [];
                var item = null;
                var children = null;
                var child = null;
                var val = null;
                var limitVal = -1;
                var remainingVal = -1;
                for (var type in resources) {
                    for (var url in resources[type]) {
                        children = [];
                        item = {
                            label: url,
                            name: url.replace(new RegExp('\/', 'g'), '_'),
                            items: children
						};
                        limitVal = -1;
                        remainingVal = -1;
                        for (var k in resources[type][url]) {
                            val = resources[type][url][k];
                            if (k === 'limit') {
                                limitVal = val;
                            } else if (k === 'remaining') {
                                remainingVal = val;
                            }
                            child = {
                                label: k + ': ' + val,
                                name: k,
                            }
                            children.push(child);
                            //item[k] = resources[type][url][k];
                        }
                        if (limitVal >= 0 && remainingVal >= 0) {
                            item.label += ' (' + remainingVal + '/' + limitVal + ')';
                        }
                        items.push(item);
                    }
                }
                component.set("v.limits", items);
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
        $A.enqueueAction(action);        
        
    }
})