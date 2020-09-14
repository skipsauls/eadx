({
    doInit: function(component, event, helper) {

		var filter = {
            datasets:{
                "eadx__opportunity":[
                    {
                        fields:[
                            "StageName"
                        ],
                        filter:{
                            operator:"in",
                            values:[
                                "Value Proposition"
                            ]
                        }
                    }
                ]
            }
        };
        

		var json = JSON.stringify(filter, null, 2);
    	component.set('v.filter', json);    
    },
    
	handleUpdate: function(component, event, helper) {
		var filter = component.get('v.filter');
        console.warn("filter: ", filter);
        var dashboardId = component.get('v.dashboardId');
        console.warn("dashboardId: ", dashboardId);
        var developerName = component.get('v.developerName');
        console.warn("developerName: ", developerName);
        
        if (developerName !== null && typeof developerName !== 'undefined' && developerName != '') {
            dashboardId = developerName;
        }
        var params = {
            value: filter,
            id: dashboardId,
            type: "dashboard"
        };
        console.warn('params: ', params);
        var evt = $A.get('e.wave:update');
        evt.setParams(params);
        evt.fire();
	}
})