({
	setup: function(component) {
		this.getTransactions(component);
	},
    
    getTransactions: function(component) {
        
        var params = {};
        
        var action = component.get("c.getVoiceTransactions");
        action.setParams(params);
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                var transactions = [];
                var transaction = null;
                var name = null;
                val.forEach(function(t) {
                    console.warn('val: ', val);
                    transaction = {};
                    for (var k in t) {
                        name = k.replace('df17eadx__', '');
                        transaction[name] = t[k];
                        
                    }
                    console.warn('transaction: ', transaction);
                    transactions.push(transaction);
                });
                component.set("v.transactions", transactions);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);        
    },
    
})