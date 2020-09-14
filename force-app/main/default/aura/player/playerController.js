({
    doInit: function(component, event, helper) {
        // Get the selections
        helper.getSelections(component);
        
    },
    
    refresh: function(component, event, helper) {
        helper.getSelections(component);
        helper.getEvents(component);
    },
    
    discover: function(component, event, helper) {
        helper.discover(component, event);
    },

    snapshot: function(component, event, helper) {
        helper.snapshot(component, event);
    },

    play: function(component, event, helper) {
        helper.play(component, event);
    },

	showDashboard: function(component, event, helper) {
        helper.showDashboard(component, event);
    },

    handleDiscoverResponse: function(component, event, helper) {
        helper.handleDiscoverResponse(component, event);
    },
        
    handleSelectionChanged: function(component, event, helper) {
        helper.handleSelectionChanged(component, event);
    },
    
    fireEvent: function(component, event, helper) {
        var source = event.getSource();
        var idx = source.get("v.value");
    	helper.fireEvent(component, idx);    
    },

    deleteEvent: function(component, event, helper) {
        var source = event.getSource();
        var idx = source.get("v.value");
    	helper.deleteEvent(component, idx);    
    },

    clean: function(component, event, helper) {
        //helper.clean(component);
        var t1 = Date.now();
       	helper.clean(component, function() {
            var t2 = Date.now();
            console.warn('clean done, timing: ', (t2 - t1) + ' ms'); 
        });        
    },
    
    selectName: function(component, event, helper) {
        component.set("v.selectedField", "name");
        helper.getEvents(component);
    },
    
    selectId: function(component, event, helper) {
        component.set("v.selectedField", "id");
        helper.getEvents(component);
    },
    
    selectStep: function(component, event, helper) {
        component.set("v.selectedField", "step");
        helper.getEvents(component);
    },
    
    selectField: function(component, event, helper) {
        component.set("v.selectedField", "field");
        helper.getEvents(component);
    }

})