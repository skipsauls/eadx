({
    
    handlePlatformEvent: function(component, event) {
        var p = event.getParam('payload');
       	console.warn('eaPlatformEventManagerHelper.handlePlatformEvent: ', JSON.stringify(p, null, 2));
        return;
        
        var type = p.df17eadx__type__c;
        var target = p.df17eadx__target__c;
        var payload = p.df7eadx__payload__c;
        
        console.warn('------------> type: ', type);
        console.warn('------------> target: ', target);
        console.warn('------------> payload: ', payload);
        
        this.updateSelection(component, true, target);
    },
    
    // Forces dashboard to redraw
    updateSelection: function(component, init, target) {
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
        
        var dashboardId = target; //component.get('v.dashboardId');
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
                self.updateSelection(component, false, target)
            }, 50));
        }
    }
})