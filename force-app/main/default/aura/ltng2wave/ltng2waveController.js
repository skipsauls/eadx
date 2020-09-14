({
	doInit: function(component, event, helper) {
        var recordId = component.get("v.recordId");
	},
    
	handleRecordIdChange: function(component, event, helper) {
        var recordId = component.get("v.recordId");
	},

    handleRecordChange: function(component, event, helper) {
        var record = component.get("v.record");
        console.warn("ltng2waveController.handleRecordChange: ", record);
	},


	handleRecordUpdated: function(component, event, helper) {
        var record = component.get("v.record");
        var fields = component.get("v.fields");
	},

	handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        var id = params.id;
        var payload = params.payload;
        var noun = params.noun;
        var verb = params.verb;
        /*
        console.warn("id: ", id);
        console.warn("payload: ", payload);
        console.warn("noun: ", noun);
        console.warn("verb: ", verb);        
        */
    },
    
	handleIndustryChange: function(component, event, helper) {
        console.warn("ltng2waveController.handleIndustryChange: ", component);
        var record = component.get("v.record");
        var industry = record.fields.Industry.value;
        var fields = component.get("v.fields");
        
        console.warn("record: ", record);
        console.warn("industry: ", industry);
        console.warn("fields: ", fields);
		var filter = {
            datasets:{
                opportunity:[
                    {
                        fields:[
                            "Account.Industry"
                        ],
                        filter:{
                            operator:"in",
                            values:[
                                industry
                            ]
                        }
                    }
                ]
            }
        };

		var json = JSON.stringify(filter);
        
    	component.set('v.filter', json);
        
        console.warn("filter: ", filter);
        
        var dashboardId = component.get('v.dashboardId');
        console.warn("dashboardId: ", dashboardId);
        var evt = $A.get('e.wave:update');
        evt.setParams({
            value: json,
            id: dashboardId,
            type: "dashboard"
        });
        evt.fire();        
	},
    
    
})