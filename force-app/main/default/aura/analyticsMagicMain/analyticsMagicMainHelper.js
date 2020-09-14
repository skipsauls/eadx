({
    setup: function(component) {
        //console.warn('analyticsMagicMainHelper.setup');
        var config = component.get('v.config');
        if (config !== null && typeof config !== 'undefined' && config !== '') {
            config = JSON.parse(config);
            //console.warn('config: ', config);
            
            $A.createComponent(config.type, config.attributes, function(cmp, status, err) {
                //console.warn('createComponent: ', cmp, status, err);
                if (status === "SUCCESS") {
                    var body = component.get("v.body");
                    body.push(cmp);
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") {
                    console.warn("No response from server or client is offline.")
                } else if (status === "ERROR") {
                    console.error("Error: ", errorMessage);
                    // Show error message
                }            
            });
        } else {
            //console.warn('No config!!!');
        }
    }
})