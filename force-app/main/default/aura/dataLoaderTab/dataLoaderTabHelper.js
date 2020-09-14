({
    loadFortnitePlayers: function(component, event, helper) {
        component.set('v.timestamp', Date.now());
        var action = component.get("c.loadFortnitePlayers");
        action.setParams({
            window: 'alltime'
        });
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                //var spinner = component.find('spinner');
                //$A.util.removeClass(spinner, 'hide');
                component.set('v.loading', true);
                console.warn('------------------------------------------------------------------------------- start loading');
                
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
    
	fireUpdate: function(component, init) {
        var self = this;
        
        //var spinner = component.find('spinner');
        //$A.util.addClass(spinner, 'hide');
        component.set('v.loading', false);
        console.warn('------------------------------------------------------------------------------- stop loading');
        
        
        var values = init === true ? [component.get('v.fieldValue')] : [null];
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
    	
        
		var json = JSON.stringify(selection);
        
        var dashboardId = component.get('v.developerName');
        var evt = $A.get('e.wave:update');
        var params = {
            value: json,
            id: dashboardId,
            type: "dashboard"
        };
        evt.setParams(params);
        evt.fire();
        
        if (init === true) {
            setTimeout($A.getCallback(function() {
                self.fireUpdate(component, false)
            }, 50));
        }		
	}
})