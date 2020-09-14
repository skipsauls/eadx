({
    listMocks: function(component, selectedName) {
        var action = component.get("c.listMocks");
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                val = val.replace(new RegExp("/\"/g"), "\"");
                var records = JSON.parse(val);
                var mocks = [];
                component.set('v.mockMap', records);
                for (var key in records) {                    
                    mocks.push(records[key]);
                }
                component.set('v.mocks', mocks);
                component.set('v.selectedMockName', selectedName);
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
    },
    
    selectMock: function(component, event) {
        var mockName = component.get('v.selectedMockName');
        if (mockName === null || typeof mockName === 'undefined') {
            return;
        }
        var mockMap = component.get('v.mockMap') || {};
        var mock = mockMap[mockName];
        if (typeof mock !== null && typeof mock !== 'undefined') {
            mock.body = JSON.stringify(JSON.parse(mock.body), null, 2);
            component.set('v.mock', mock);            
        }
      
    },
    
    updateMock: function(component, event) {
        var mock = component.get('v.mock');
        //var body = component.get('v.mockBody');
        
        // Remove formatting (also validates!)
        var body = JSON.parse(mock.body);
        body = JSON.stringify(body);
        
        var action = component.get("c.putMock");
        action.setParams({name: mock.name, body: body});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                self.updateSelection(component, true);
            	self.listMocks(component, mock.name);
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
    },
        
    // Forces dashboard to redraw
    // Updated to use getState/setState rather than events
  	updateSelection: function(component, init) {
        let config = {};
        let dashboard = component.find('dashboard');
       	dashboard.getState(config, function(res, err) {
            res.payload.state.steps.StageName_1.values = res.payload.state.steps.StageName_1.values.length > 0 ? [] : [component.get('v.fieldValue')];
            dashboard.setState(res.payload, function(res, err) {
            });
        });        
    },

    OLDER_updateSelection: function(component, init) {
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
        
        var dashboardId = component.get('v.dashboardId');
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
                self.updateSelection(component, false)
            }, 50));
        }
    }
    
    
})