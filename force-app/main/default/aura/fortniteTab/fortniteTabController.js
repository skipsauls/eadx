({
    doInit: function(component, event, helper) {
        helper.setupBackground(component);
    },

    changeBackground: function(component, event, helper) {
        helper.rotateBackground(component);
    },
    
    handleSelectionChanged: function (component, event, helper) {
        var payload = event.getParam('payload');
        if (payload && payload.step === 'fortnite_locations_l_1') {
            var data = payload.data;
            var name = data.name;
            var filter = JSON.stringify({});
            var developerName = component.get('v.developerName');
            var pageId = 'Details_Page';
            var evt = $A.get('e.wave:update');
            var params = {
                value: filter,
                id: developerName,
                pageid: pageId,
                type: "dashboard"
            };
            evt.setParams(params);
            evt.fire();            
        }
    }
})