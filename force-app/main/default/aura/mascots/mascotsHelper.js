({
	setup: function(component) {
		var mainContent = component.find('main_content').getElement();
        var url = $A.get('$Resource.df17eadx__lightning_bolt');
        component.set("v.bolt_url", url);
	}
})