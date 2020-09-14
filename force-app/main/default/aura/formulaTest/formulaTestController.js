({
    test: function(component, event, helper) {
        
        var action = component.get("c.parseFormulas");
        var formulas = '[{"set":{"name":"FOO","value":123},"formula":"SUM(FOO,2,3)"},{"set":{"name":"BAR","formula":"MAX(102,66,99,24,FOO)"},"get":{"name":"BAR"}}]';
        action.setParams({formulas: formulas, dummy: "foo"});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                val = val.replace(new RegExp("/\"/g"), "\"");
                var res = JSON.parse(val);                                
                console.warn('res: ', JSON.stringify(res, null, 2));
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                        if (typeof callback === "function") {
                            callback(errors, null);
                        }
                    }
                } else {
                    console.error("Unknown error");
                    if (typeof callback === "function") {
                        callback({error: 'Unknown error'}, null);
                    }
                }
            }            
        });
        $A.enqueueAction(action);
        
    }
})