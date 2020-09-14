({
	   doInit : function(component, event, helper) {
		var action = component.get("v.commanderAction")
        $A.createComponent(
            "c:CommanderIntentList",
            {
                "actionIntents": action.intents
            },
            
            function(newInp, status, errorMessage){
                if (status === "SUCCESS") {
                    var body = component.get("v.body");
                    body.push(newInp);
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                }
                else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }        
                else {
                    console.log('Unknown problem, state: ' + state +
                                            ', error: ' + JSON.stringify(response.getError()));
                 }
        })         
	}
})