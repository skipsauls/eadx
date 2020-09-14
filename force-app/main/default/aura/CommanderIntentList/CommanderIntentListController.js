({
	   doInit : function(component, event, helper) {
		var intents = component.get('v.actionIntents');
        var body = component.get("v.body");
        body = "";
        for(var i in intents){
            $A.createComponent( "c:formattedIntentOutput",
                {
                    "phrase":intents[i].phrase, 
                    "actionParameters":intents[i].parameters    		
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
                }
       		);
        }
	}
})