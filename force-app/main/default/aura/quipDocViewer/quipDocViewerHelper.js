({
	getThreads: function(component, threadIds, callback) {
        this.getList(component, "threads", threadIds, callback);
    },
    
    getList: function(component, type, ids, callback) {
		
        ids = typeof ids === 'string' ? [ids] : ids;
            
        if (typeof ids === "undefined" || ids == null || ids.length === 0) {
            if (typeof callback === "function") {
                callback({error: "No Ids"}, null);
            } else {
                return null;
            }
        } else {
            
            console.warn("quipDemoHelper.getList: ", type, ids);
            
            var action = component.get("c.getList");
            action.setParams({type: type, ids: ids});
            var self = this;
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var val = response.getReturnValue();
                    val = val.replace(new RegExp("/\"/g"), "\"");
                    var res = JSON.parse(val);                                
                    console.warn('res: ', JSON.stringify(res, null, 2));
                    if (typeof callback === "function") {
                        callback(null, res);
                    }
                }
                else if (state === "INCOMPLETE") {
                    // do something
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + errors[0].message);
                            if (typeof callback === "function") {
                                callback(errors, null);
                            }
                        }
                    } else {
                        console.error("Unknown error");
                        if (typeof callback === "function") {
                            callback({error: 'Unknown error'}, null);
                        }
                    }
                }            
            });
            $A.enqueueAction(action);
        }
	}
})