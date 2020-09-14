({
    doInit: function(component, event, helper) {
        //var selection = "Please select a dashboard";
        //component.set("v.selection", selection);
    },
    
    selectDashboard: function(component, event, helper) {
        helper.getSelection(component);    
    },

    update: function(component, event, helper) {
        helper.update(component);    
    },

    fireEvent: function(component, event, helper) {
        var selectionJSON = component.get('v.selectionJSON');
        var dashboardId = component.get('v.dashboardId');
        var developerName = component.get('v.developerName');
        try {
            var obj = JSON.parse(selectionJSON);
            var selection = JSON.stringify(obj);
            
            var evt = component.getEvent("update");
            //var evt = $A.get('e.wave:update');
            var params = {
                value: selection,
                //id: dashboardId,
                devName: developerName,
                type: "dashboard"
            };
            console.warn('params: ', params);
            evt.setParams(params);
            evt.fire();
            
        } catch (e) {
            console.warn("JSON exception: ", e);
            helper.showToast(component, "Error", "The selection JSON is invalid JSON, please check and try again.", "error", null);
            
        }
    }
})