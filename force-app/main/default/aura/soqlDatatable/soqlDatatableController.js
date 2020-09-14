({
	init: function(component, event, helper) {
		helper.listObjects(component);	
	},

    handleStatecodeChange: function(component, event, helper) {
		helper.listObjects(component);	
	},
    
    handleCountrycodeChange: function(component, event, helper) {
		helper.listObjects(component);	
	},
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        var id = params.id;
        component.set("v.dashboardId", id);
        var payload = params.payload;
        //console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            //console.warn("step: ", step);
            var data = payload.data;
            //console.warn("data: ", data);

            // Keep count of the number of selected items 
            var selectedSteps = component.get('v.selectedSteps') || {};
            var stepCount = selectedSteps[step];
            //console.warn('stepCount: ', stepCount);
            
            if (data.length > 0) {
                selectedSteps[step] = data.length;
	            component.set('v.selectedSteps', selectedSteps);
				helper.handleSelectionChanged(component, id, step, data);                
            } else if (stepCount > 0) {
                selectedSteps[step] = 0;
	            component.set('v.selectedSteps', selectedSteps);
                helper.handleSelectionChanged(component, id, step, data);                    
			}
           
        }
    }    
})