({
    describeDashboard : function(component, event, helper) {
         var oTextArea = component.find("oTextArea");
        var context={apiVersion:"41"};
        var methodName = "describeDashboard";
        var methodParameters = {dashboardId:component.find("idTextBox").get("v.value")};
        component.find("cComp").invokeMethod(context, methodName, methodParameters, function(error,data){
            if(error==null){
            component.set("v.responseValue", JSON.stringify(data));
            oTextArea.set("v.value", JSON.stringify(data));    
            }else {component.set("v.responseValue", JSON.stringify(error));
                   oTextArea.set("v.value", JSON.stringify(error[0].message));  
                  }
        }); 
        console.log("Response:: ", component.get("v.responseValue"));
    },
    displayResults : function(component,event,helper) {
        console.log("Receiving Selection details from Wave Dashboard Component.");
        var oTextArea = component.find("oTextArea");
        oTextArea.set("v.value", component.get("v.responseValue"));
    },
    discoverDash : function(component, event, helper) {
        console.log("Discover Dashboard");
        component.set("v.outValue",[]);
        $A.get("e.wave:discover").fire();
    },
   discoveryResponse : function(component,event,helper) {
        console.log("Receiving Dashboard Discovery Details details from Wave.");
        var oTextArea = component.find("oTextArea");
        var outValue = "\n\nId :: " + event.getParam("id") + "\n"+
        "Type ::" + JSON.stringify(event.getParam("type")) + "\n" +
        "IsLoaded :: " + JSON.stringify(event.getParam("isLoaded")) ;
        component.get("v.outValue").push(outValue);
        oTextArea.set("v.value", (component.get("v.outValue")));
    }
})