({
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', params);
        console.warn('json: ', JSON.stringify(params, null, 2));
        
        if (params.verb === 'selection' && params.noun === 'dashboard') {
            
        }
        
        for (var k in params) {
            console.warn('param ', k, ': ', params[k]);
        }
        
        var id = params.id;
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;
        
        if (payload) {                
            var step = payload.step;
            var data = payload.data;
            console.warn("data: ", data);
            var idx = 0;
            
            var fieldKeys = {};
            var fields = [];
            var selection = [];
        
            data.forEach(function(obj) {
                for (var k in obj) {
                    console.warn('data - ', k, ': ', obj[k]);
                    if (k !== 'count' && k !== 'order') {
                        fieldKeys[k] = 1;
	                    selection.push(obj[k]);                
                    }
                }
            });

            Object.keys(fieldKeys).forEach(function(k){
                console.warn('k: ', k);
                fields.push(k);
            });
            
            var name = 'Test'; // <--------- Need to set or generate this?
            console.warn('name: ', name);
            
            console.warn('id: ', id);
            console.warn("step: ", step);
            console.warn('fields: ', fields);
            console.warn('selection: ', selection);
            
            if (selection.length <= 0 || fields.length <= 0) {
                // Do nothing as the selection isn't interesting
            } else {
                var params = {
                    name: name,
                    id: id,
                    step: step,                
                    fields: fields.join(),
                    selection: selection.join()
                };
                
                console.warn('params: ', params);
    
                var action = component.get("c.addSelection");
                action.setParams(params);
                var self = this;
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var val = response.getReturnValue();
                        console.warn('val: ', val);
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
                
            
            
        }
    }
})