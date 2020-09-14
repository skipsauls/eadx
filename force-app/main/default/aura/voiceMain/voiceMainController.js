({
	doSuggest: function(component, event, helper) {
        component.set('v.currentState', 'SUGGEST')
		var navigate = component.get('v.navigateFlow');
		navigate('NEXT'); 		
	},

	doDictate: function(component, event, helper) {
        component.set('v.currentState', 'DICTATE')
		var navigate = component.get('v.navigateFlow');
		navigate('NEXT'); 		
	}    
})