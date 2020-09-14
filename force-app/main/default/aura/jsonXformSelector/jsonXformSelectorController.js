({
	init: function(component, event, helper) {
        let self = this;
        
        let action = component.get("c.listXforms");
        
        action.setParams({});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let results = response.getReturnValue();
                console.warn('listXforms results: ', results);
                component.set('v.xforms', results);
                if (typeof callback === 'function') {
                    callback(null, results);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);  		
	},

    selectItem: function(component, event, helper) {
        console.warn('selectItem - event: ', event);
        let target = event.target;
        let parent = target;
        while (parent.nodeName !== 'LI' && parent.parentNode !== null) {
            parent = parent.parentNode;
        }
        
        let id = parent.dataset.id;
        console.warn('id: ', id);
        let name = parent.dataset.name;
        console.warn('name: ', name);
        
        let xforms = component.get('v.xforms');
        let xform = null;
        for (let i = 0; i < xforms.length; i++) {
            xform = xforms[i];
            if (xform.Id === id) {
                break;
            }            
        }
        console.warn('xform: ', xform);
        document.querySelectorAll('.item').forEach(function(i) {i.classList.remove('selected'); })
        target.classList.add('selected');
        
        console.warn('xform: ', xform);
        component.set('v.xform', xform);
        component.set('v.name', xform.Name);
    }     
})