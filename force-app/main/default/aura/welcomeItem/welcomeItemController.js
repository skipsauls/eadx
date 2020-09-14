({
	doInit: function(component, event, helper) {
        var resourceName = component.get('v.resourceName');
        var imageName = component.get('v.imageName');
        
        var imageUrl = $A.get('$Resource.' + resourceName) + imageName;
        
        component.set('v.imageUrl', imageUrl);
	}
})