({
	playSound: function(component, event, helper) {
        var target = event.getSource();
        var name = target.get('v.name');
		var sfx = component.find('sfx');
        sfx.playSound(name);
	}
})