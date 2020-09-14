({
	doInit: function(component, event, helper) {
		helper.updateList(component);       		
	},

	selectList: function(component, event, helper) {
		helper.updateListItems(component);       		
	},
    
    addItem: function(component, event, helper) {
        var selectedItems = component.get("v.selectedItems");
        selectedItems.push("");
        component.set("v.selectedItems", selectedItems);
	},

    updateItem: function(component, event, helper) {
		var target = event.getSource();
        var index = target.get("v.name");
        var value = target.get("v.value");
        var selectedItems = component.get("v.selectedItems");
        selectedItems.forEach(function(s, i) {
            if (i === index) {
	            selectedItems[i] = value;
            } 
        });
        component.set("v.selectedItems", selectedItems);
	},
    
    moveItemUp: function(component, event, helper) {
		var target = event.getSource();
        var index = target.get("v.name");
        if (index === 0) {
            return;
        }
        var selectedItems = component.get("v.selectedItems");
      	var items = [];
        var selectedItem = selectedItems[index];
        var s = null;
        for (var i = 0; i < selectedItems.length; i++) {
            s = selectedItems[i];
            if (i === index - 1) {
                items.push(selectedItem);
                items.push(s);
                i++;
            } else {
                items.push(s);
            }
        }
        component.set("v.selectedItems", items);
	},

	moveItemDown: function(component, event, helper) {
		var target = event.getSource();
        var index = target.get("v.name");
        var selectedItems = component.get("v.selectedItems");
        if (index >= selectedItems.length - 1) {
            return;
        }
      	var items = [];
        var selectedItem = selectedItems[index];
        var s = null;
        for (var i = 0; i < selectedItems.length; i++) {
            s = selectedItems[i];
            if (i === index) {
                items.push(selectedItems[i + 1]);
                items.push(selectedItem);
                i++;
            } else {
                items.push(s);
            }
        }
        component.set("v.selectedItems", items);
	},

    deleteItem: function(component, event, helper) {
		var target = event.getSource();
        var index = target.get("v.name");
        var selectedItems = component.get("v.selectedItems");
      	var prunedItems = [];
        selectedItems.forEach(function(s, i) {
            if (i !== index) {
                prunedItems.push(s);
            } 
        });
        component.set("v.selectedItems", prunedItems);
	},
        
	updateList: function(component, event, helper) {
        var action = component.get("c.updateApexStepList");
        var selectedName = component.get("v.selectedName");
        var selectedItems = component.get("v.selectedItems");
        action.setParams({name: selectedName, items: selectedItems.join()});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
				helper.updateList(component);       
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

	deleteList: function(component, event, helper) {
        var action = component.get("c.deleteApexStepList");
        var selectedName = component.get("v.selectedName");
        action.setParams({name: selectedName});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                component.set("v.selectedName", null);
				helper.updateList(component);       
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
    
	getList: function(component, event, helper) {
        var action = component.get("c.getApexStepList");
        var name = component.get("v.selectedName");
        action.setParams({name: name});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
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
		
	}
    
})