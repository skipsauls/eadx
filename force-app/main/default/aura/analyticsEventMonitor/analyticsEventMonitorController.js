({
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        var id = params.id;
        console.warn('dashboard id: ', id);
        var payload = params.payload;
        console.warn('payload: ', JSON.stringify(payload, null, 2));
        if (payload) {                
            var step = payload.step;
            console.warn('step: ', step);
            var data = payload.data;
            console.warn('data: ', JSON.stringify(data, null, 2));
            data.forEach(function(obj) {
                for (var k in obj) {
	                console.warn(k + ': ' + obj[k]);
                }
            });
        }
    }
})