({
	init : function(cmp, event, helper) {
	},
    
	setWairCreateHandler : function(cmp, event, helper) {
        var args = event.getParam('arguments');
		cmp.set('v.onAutoInstallCreateHandler', args.handler);
	},
    
    createApp : function(cmp, event, helper) {
        helper.createAppRequest(cmp, event, helper);
	}
})