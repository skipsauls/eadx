({
   doInit : function(component, event, helper) {
        var commanderApi = component.find('commanderApi');
           commanderApi.describe(null,null, null,function(response){            
            component.set('v.commanderActions', response["actions"]);
          
        })
   }
})