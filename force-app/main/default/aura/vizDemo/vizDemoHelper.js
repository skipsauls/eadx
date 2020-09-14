({
	fireSelectionEvent: function(component, fields, selection) {
        fields = fields instanceof Array ? fields : [fields];
        selection = selection instanceof Array ? selection : [selection];
        console.warn('fireSelectionEvent: ', fields, selection);
        let payload = {
            datasets: {
                'eadx__Tableau_Overview_Recipe': [
                    {
                        fields: fields,
                        selection: selection
                    }
                ]
            }
        };

        var dashboardId = component.get('v.dashboardId');
        var developerName = component.get('v.dashboardDevName');
        
        try {
            //var obj = JSON.parse(selectionJSON);
            var payloadJson = JSON.stringify(payload);
            
            var evt = component.getEvent("update");
            var evt = $A.get('e.wave:update');
            var params = {
                value: payloadJson,
                //id: dashboardId,
                devName: developerName,
                type: "dashboard"
            };
            console.warn('params: ', params);
            //console.warn('params JSON: ', JSON.stringify(params, null, 2));
            evt.setParams(params);
            evt.fire();
            
        } catch (e) {
            console.warn("JSON exception: ", e);
            helper.showToast(component, "Error", "The selection JSON is invalid JSON, please check and try again.", "error", null);
            
        }        
		
	}
})