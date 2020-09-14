({
    refresh: function(component, event, helper) {
        let t1 = Date.now();
        let dashboardId = component.get('v.dashboardId');
        let height = component.get('v.height');
        
        let foo = 'Qualification';
        let filter = '{"datasets": {"eadx__oppty_demo": [{"fields": ["StageName"],"filter": {"operator": "in","values": ["' + foo + '"]}}]}}';
        
        let config = {
            dashboardId: dashboardId,
            height: height,
            openLinksInNewWindow: false,
            showHeader: false,
            showTitle: false,
            showSharing: false,
            filter: filter
        };
        
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            let dashboard = component.find("dashboard");
            if (err) {
                console.warn("error: ", err);
            } else {
                dashboard.set("v.body", [cmp]);
            }
            let t2 = Date.now();
            console.warn('$A.createComponent timing: ' + (t2 - t1) + ' ms');
        });
        
    },

    test: function(component, event, helper) {
        console.warn('calling webkit.messageHandlers.geocodeAddress.postMessage');
        try {
            webkit.messageHandlers.geocodeAddress.postMessage({ 
                street: '11 Allensby Lane',
                city: 'San Rafael',
                state: 'CA',
                country: 'USA'
            });
        } catch (e) {
            
        }        
        
        let foo = 'Qualification';
        let filter = '{"datasets": {"eadx__opportunity": [{"fields": ["StageName"],"filter": {"operator": "in","values": ["' + foo + '"]}}]}}';
        console.warn('filter: ', filter);
        console.warn('filter: ', JSON.stringify(filter, null, 2));
        let params = {id: "0FKB0000000E1iROAS", type: "dashboard", value: filter};
        console.warn('params: ', params);
        console.warn('params: ', JSON.stringify(params, null, 2));
        
        let evt = $A.get("e.wave:update");
        evt.setParams(params);
        evt.fire();
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params));
        var id = params.id;
        component.set("v.dashboardId", id);
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            console.warn("step: ", step);
            var data = payload.data;
            console.warn("data: ", data);
            var idx = 0;
            data.forEach(function(obj) {
                for (var k in obj) {
                    console.warn(k + ': ' + obj[k]);
                }
            });
        }
        
        try {
            
            if (webkit && webkit.messageHandlers && webkit.messageHandlers.handleWaveSelectionChanged) {
                console.warn('calling webkit.messageHandlers.handleWaveSelectionChanged.postMessage');
                webkit.messageHandlers.handleWaveSelectionChanged.postMessage({ 
                    id: params.id,
                    payload: payload
                });
            }
        } catch (e) {
            
        }
    }
    
})