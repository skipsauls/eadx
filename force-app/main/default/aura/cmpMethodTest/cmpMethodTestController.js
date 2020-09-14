({
    echoLocal: function(component, event, helper) {
        var params = event.getParam('arguments');
        var text = params.text;
        var callback = params.callback;
		helper.echoLocal(component, text, callback);       
    },

    echoRemote: function(component, event, helper) {
        var params = event.getParam('arguments');
        var text = params.text;
        var callback = params.callback;
		helper.echoRemote(component, text, callback);       
    },
    
    doEchoLocal: function(component, event, helper) {
        var text = component.get('v.text');
        helper.echoLocal(component, text, function(err, val) {
            alert('Local returned: ' + val);
        });       
    },

    doEchoRemote: function(component, event, helper) {
        var text = component.get('v.text');
        helper.echoRemote(component, text, function(err, val) {
            alert('Remote returned: ' + val);
        });       
    }
})