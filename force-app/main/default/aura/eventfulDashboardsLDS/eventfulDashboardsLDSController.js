({
    doInit: function(component, event, helper) {
        console.warn('doInit');
    },
    
    recordUpdated: function(component, event, helper) {
        console.warn('recordUpdated');
        let fieldSwitch = component.get("v.fieldSwitch");
        fieldSwitch = fieldSwitch === 'A' ? 'B' : 'A';
        console.warn('fieldSwitch: ', fieldSwitch);
        component.set("v.fieldSwitch", fieldSwitch);        
        
        let selection = { datasets: {} };
        
        selection.datasets[component.get("v.datasetName")] = [{
            fields: [component.get('v.fieldName')],
            selection: [fieldSwitch]
        }];
        
        let evt = $A.get('e.wave:update');
        let params = {
            value: JSON.stringify(selection),
            devName: component.get('v.dashboardName'),
            type: "dashboard"
        };
        console.warn('params: ', params);
        evt.setParams(params);
        evt.fire();        
    }
})