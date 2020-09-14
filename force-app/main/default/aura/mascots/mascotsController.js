({
	doInit: function(component, event, helper) {
		
	},

	test: function(component, event, helper) {
		var mainContent = component.find('main_content').getElement();
        var url = component.get("v.bolt_url");
        mainContent.style.backgroundImage = 'url(' + url + ')';
		mainContent.classList.add('animate');
        setTimeout($A.getCallback(function() {
	        mainContent.style.backgroundImage = '';
            mainContent.classList.remove('animate');
        }), 500);
	}
    
})