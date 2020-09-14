({
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        var id = params.id;
        component.set("v.dashboardId", id);
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            console.warn("step: ", step);
            component.set("v.step", step);
            var data = payload.data;
            var tbody = component.find("tbody").getElement();
            if (tbody) {
                tbody.innerHTML = "";
                var idx = 0;
                data.forEach(function(obj) {
                    for (var k in obj) {
                        row = helper.createRow(component, idx, k, obj);
                        tbody.appendChild(row);
                    }
                    idx++;
                });
            }
        }
    }
})