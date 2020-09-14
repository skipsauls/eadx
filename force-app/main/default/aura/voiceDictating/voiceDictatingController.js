({
    handleInputTextChange: function(component, event, helper) {
        var inputText = component.get('v.inputText');
        console.warn('inputText: ', inputText);
        
        var navigate = component.get('v.navigateFlow');
        navigate('NEXT'); 	
    }
})