({
	changePageToPrivate: function(component, event, helper) {
        let devName = component.get('v.goodDeveloperName');
		let evt = $A.get('e.wave:pageChange');
        let params = {"devName": devName,"pageid": "Private_Page"};
        evt.setParams(params);
        evt.fire();
	},
    
	changePageToPublic: function(component, event, helper) {
        let devName = component.get('v.goodDeveloperName');
		let evt = $A.get('e.wave:pageChange');
        let params = {"devName": devName,"pageid": "Public_Page"};
        evt.setParams(params);
        evt.fire();
	},
    
    changeDevName: function(component, event, helper) {
        let devName = component.get('v.altDeveloperName');
		let evt = $A.get('e.wave:pageChange');
        let params = {"devName": devName,"pageid": "Public_Page"};
        evt.setParams(params);
        evt.fire();
	},

    filterInUpdate: function(component, event, helper) {
        let id = component.get('v.goodDashboardId');
        
		var filter = {
            datasets:{
                "eadx__oppty_demo":[
                    {
                        fields:[
                            "StageName"
                        ],
                        filter:{
                            operator:"in",
                            values:[
                                "Prospecting"
                            ]
                        }
                    }
                ]
            }
        };
        
		let evt = $A.get('e.wave:update');
        let params = {
            id: id,
            type: 'dashboard',
            value: JSON.stringify(filter)
        };
        evt.setParams(params);
        console.warn('evt.getParams(): ', JSON.stringify(evt.getParams(), null, 2));
        evt.fire();
	},

    changeIdInUpdate: function(component, event, helper) {
        let id = component.get('v.altDashboardId');
        
		var filter = {
            datasets:{
                "eadx__oppty_demo":[
                    {
                        fields:[
                            "StageName"
                        ],
                        filter:{
                            operator:"in",
                            values:[
                                "Prospecting"
                            ]
                        }
                    }
                ]
            }
        };
        
		let evt = $A.get('e.wave:update');
        let params = {
            id: id,
            type: 'dashboard',
            value: JSON.stringify(filter)
        };
        evt.setParams(params);
        console.warn('evt.getParams(): ', JSON.stringify(evt.getParams(), null, 2));
        evt.fire();
	}
    
})