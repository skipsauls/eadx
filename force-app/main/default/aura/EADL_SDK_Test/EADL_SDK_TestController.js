({
	init: function(component, event, helper) {
        
        component.set('v.columns', helper.columns);
        component.set('v.data', helper.countries);
        
		let namespace = component.getType().split(':')[0];
        console.warn('namespace: ', namespace);
        let developerName = component.get('v.developerName');
        console.warn('developerName: ' + developerName);

        if (namespace && namespace !== 'c') {
            developerName = namespace + '__' + developerName;
            console.warn('developerName: ' + developerName);
            component.set('v.developerName', developerName);
        }

	},
    
    handleSelectionChanged: function(component, event, helper) {
        let params = event.getParams();
        console.warn('params: ', JSON.stringify(params));
        let id = params.id;
        component.set("v.dashboardId", id);
        let payload = params.payload;
        console.warn("payload: ", payload);
        let row = null;        
        if (payload) {                
            let step = payload.step;
            console.warn("step: ", step);
            let data = payload.data;
            console.warn("data: ", data);
            let idx = 0;
            data.forEach(function(obj) {
                for (let k in obj) {
	                console.warn(k + ': ' + obj[k]);
                    helper.filterData(component, k, obj[k]);
                }
            });
        }
    },
    
    updateSelectedCountries: function(component, event, helper) {
        let selectedRows = event.getParam('selectedRows');
        console.warn('selectedRows');
    }
})