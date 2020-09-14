({
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        //console.warn('params: ', JSON.stringify(params));
        var id = params.id;
        //console.warn('id: ', id);
        if (id !== null && typeof id !== 'undefined') {
        	component.set("v.dashboardId", id);
        }
        var payload = params.payload;
        //console.warn("payload: ", JSON.stringify(payload, null, 2));        
        var row = null;        
        if (payload) {
            helper.generateQueryFromPayload(component, payload);
            /*
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
            */
        }        
    },
    
    selectDashboard: function(component, event, helper) {
        helper.selectDashboard(component);
    }
})