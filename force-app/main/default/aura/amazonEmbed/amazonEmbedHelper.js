({
    changeASIN : function(component) {
        var asin = component.get("v.asin");
        console.warn("asin");
        
        var action = component.get("c.getItem");
        action.setParams({asin: asin});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                val = val.replace(new RegExp("/\"/g"), "\"");
                var res = JSON.parse(val);                
                console.warn('res: ', JSON.stringify(res, null, 2));
                var item = res[0];
                for (var key in item) {
                    component.set("v." + key, item[key]);
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
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);
    }
})