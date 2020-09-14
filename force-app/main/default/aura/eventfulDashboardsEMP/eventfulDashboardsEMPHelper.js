({
    setupEMP: function(component) {
        let empApi = component.find("empApi");
        let channel = '/event/Eventful_Dashboard__e';
        let replayId = -1;
        let self = this;
        let callback = function (message) {
            self.recordUpdated(component);
        }.bind(this);
        
        let errorHandler = function (message) {
        }.bind(this);
        
        empApi.onError(errorHandler);
        
        empApi.subscribe(channel, replayId, callback).then(function(value) {
            component.set("v.sub", value);
        });         
    },
    
    recordUpdated: function(component) {
        let fieldSwitch = component.get("v.fieldSwitch");
        fieldSwitch = fieldSwitch === 'A' ? 'B' : 'A';      
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