({
	init: function(component, event, helper) {
        console.warn("init");
        
        window.fireLightningEvent = function(type, paramsJson) {
            console.warn('fireLightningEvent: ', type, paramsJson);
            var params = JSON.parse(paramsJson);            
            console.warn('params: ', params);
            params.value = JSON.stringify(params.value);
            console.warn('params: ', params);
            if (type === 'wave:update') {
                var evt = $A.get('e.wave:update');
                evt.setParams(params);
                evt.fire();              
            }
        }        
    },
    
    selectDashboard: function(component, event, helper) {
    	var dashboardId = component.get("v.dashboardId");
        var config = {
            dashboardId: dashboardId,
            height: "680",
            openLinksInNewWindow: false,
            showHeader: false,
            showTitle: false,
            showSharing: false
        };
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            if (err) {
                console.warn("error: ", err);
            } else {
                $A.util.addClass(cmp, "dashboard-container");
                component.find("dashboard").set("v.body", [cmp]);
            }            
        });
    },
    
    onWaveSelectionChanged: function(component, event, helper) {        
        console.warn('################################ onWaveSelectionChanged: ', event);
        let params = event.getParams();
        let value = null;
        
        // Try to send to native webview
        try {
            let evt = {
                type: event.getType(),
                params: {}
            };
            for (var key in params) {                
                value = params[key];
                console.warn('key: ', key, ', value: ', value);
                evt.params[key] = value;
            }
            console.warn('evt: ', evt);

            let json = JSON.stringify(evt);
            webkit.messageHandlers.callback.postMessage(json);
        } catch (e) {
            console.warn('Exception: ', e);
        }
    }        
    
})