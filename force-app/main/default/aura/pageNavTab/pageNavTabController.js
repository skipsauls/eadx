({
    test: function(component, event, helper) {
        var namespace = component.getType().split(':')[0];
        var state = null;
        var pageReference = {
            type: 'standard__navItemPage',
            attributes: {
                apiName: namespace + '__Analytics_Dashboard'
            },
            state: state
        };        
        var navService = component.find("navService");
        if (navService){
            navService.generateUrl(pageReference)
            .then($A.getCallback(function(url){
                $A.log('url:' + url);
                navService.navigate(pageReference);
            }), $A.getCallback(function(error){
                $A.log('Record url error:' + error);
            }));
        }
    }
})