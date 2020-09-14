({
    toggleFullScreen: function(component, event, helper) {
        var fullScreen = component.get('v.fullScreen');
        fullScreen = !fullScreen;
        component.set('v.fullScreen', fullScreen);
        console.warn('fullScreen: ', fullScreen);
        
        var outer = component.find('outer');
        var elem = outer.getElement();
        console.warn('elem: ', elem);
        console.warn('elem.requestFullscreen: ', elem.requestFullscreen);
        if (fullScreen === true) {
            if (elem.webkitRequestFullScreen) {
	            elem.webkitRequestFullScreen();
            }
        } else {
            //if (document.webkitExitFullScreen) {
	        //    document.webkitExitFullScreen();
            //}
                    
        }
    },
    
    toggleUtilityItem: function(component, event, helper) {
        var source = event.getSource();
        var name = source.get("v.name");
        console.warn("toggle: ", name);
        var item = component.find(name);
        $A.util.toggleClass(item, 'hide');
    }
})