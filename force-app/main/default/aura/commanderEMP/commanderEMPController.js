({
	init: function(cmp, event, helper){

	},
    
    handleSubscribedChange: function(cmp, event, helper) {
		helper.setup(cmp);
	},
    
    subscribe: function(cmp, event, helper) {
        helper.subscribe(cmp);
    },

    unsubscribe: function(cmp, event, helper) {
        helper.unsubscribe(cmp);
    }
})