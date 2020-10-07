({
	getListView: function(component) {
        let sobjectType = component.get('v.sobjectType');
        let developerName = component.get('v.developerName');
        
        let action = component.get('c.describeListView');        
        action.setParams({sobjectType: sobjectType, developerName: developerName});
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var listViewDescribe = response.getReturnValue();
                console.warn('listViewDescribe: ', listViewDescribe);		
            } else {
                
            }
        });
	}
})