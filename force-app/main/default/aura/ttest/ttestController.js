({
	test: function(component, event, helper) {
		
        var sdk = component.find('sdk');
        
        var context = {apiVersion: "49"};
        var methodName = 'listDashboards';
        var methodParameters = {};

        var methodParameters = {
            'templateApiName' : 'eadx__Mortgage_Calculator'
        };
        /*        
        var methodParameters = {
            'templateSourceId' : templateSourceId,
            'pageSize' : pageSize,
            'q' : q,
            'sort' : sort,
            'scope' : scope,
            'page' : page,
            'isPinned' : isPinned,
            'mobileOnly' : false
        };
*/        
        sdk.invokeMethod(context, methodName, methodParameters,
                         $A.getCallback(function (err, data) {
                             if (err !== null) {
                                 //DO THIS IF THE METHOD FAILS
                                 console.error("SDK error", err);
                             } else {
                                 //DO THIS IF THE METHOD SUCCEEDS
                                 console.warn('data: ', data);
                                 data.templates.forEach(function(d) {
                                     console.warn(d.templateType, d.name, d.label, d);
                                 });
                             }
                         }));

	}
})