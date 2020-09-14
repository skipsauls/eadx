({
	doTest: function(component, event, helper) {
        var action = component.get("c.test");
        var self = this;
        var communityId = component.get('v.communityId');
        var subjectId = component.get('v.subjectId');
        var text = component.get('v.text');
        action.setParams({communityId: communityId, subjectId: subjectId, text: text});
        action.setCallback(this, function(response) {
            console.warn('response: ', response);
            var state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
            }            
        });
        $A.enqueueAction(action);		
	}
})