({
	scriptsLoaded: function(component, event, helper) {
		console.warn('scriptsLoaded');
	},
    
	doDog: function(component, event, helper) {
        let target = event.getSource();
        let name = component.get('v.name');
        let dog = new window.Dog(name);
        let dogs = component.get('v.dogs');
        dogs.push(dog);
        component.set('v.dogs', dogs);
	},
    
    doSpeak: function(component, event, helper) {
        let target = event.getSource();
        let index = target.get('v.name');
        let dogs = component.get('v.dogs');
        let dog = dogs[index];
        dog.speak();
        component.set('v.dogs', dogs);
    }
})