({
	init: function(component, event, helper) {
        let self = this;		
        let action = component.get("c.getDatasetVersionIds");
        let datasetName = component.get('v.datasetName');
        action.setParams({datasetName: datasetName});        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let datasetVersionIds = response.getReturnValue();
                component.set('v.datasetId', datasetVersionIds.datasetId);
                component.set('v.versionId', datasetVersionIds.versionId);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                let err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);
	}
})