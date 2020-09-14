({
	init: function(component, event, helper) {
    },
    
	test: function(component, event, helper) {
        var proxy = component.find('proxy');
        proxy.listAssets('dashboards', function(response) {
            response = JSON.parse(JSON.stringify(response));
            console.warn('waveExplorerHelper.listAssets - response: ', response);
        });
	}
})