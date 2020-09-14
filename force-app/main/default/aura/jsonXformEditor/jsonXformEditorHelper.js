({
    setup: function(component) {
        let self = this;

    },
    
    saveXform: function(component, callback) {
        let self = this;
        
        let action = component.get("c.saveJson");
        
        let name = component.get('v.name');
        console.warn('jsonXformEditorHelper.saveXform - name: ', name);
        
        if (name === null || typeof name === 'undefined' || name === '') {
            self.showToast(component, 'Missing Name', 'Please enter a name for the transform.', 'error');
        } else {
            
            let document = component.get('v.document');
            let values = component.get('v.values');
            let definition = component.get('v.definition');
            
            action.setParams({
                name: name,
                document: JSON.stringify(document),
                values: JSON.stringify(values),
                definition: JSON.stringify(definition)
            });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    let results = response.getReturnValue();
                    console.warn('save results: ', results);
                    let parent = component.get('v.parent');
                    parent.showToast('Saved', 'Saved ' + name + ' (' + results + ')', 'success');
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
        }
    }
    
})