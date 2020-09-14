({
    template: {
        datasets: {
            "": [
                {
                    fields: [],
                    selection: []
                }
            ]
        }        
    },
    
    selections: {
        "default": {
            datasets: {
                "df17eadx__dataset_name": [
                    {
                        fields: ["field_name"],
                        selection: ["value_0","value_1"]
                    }
                ]
            }
        },
        "0FK1I000000Dh6gWAC": {
            datasets: {
                "df17eadx__DTC_Opportunity_SAMPLE": [
                    {
                        fields: ["Stage"],
                        selection: ["03 - Needs Analysis","05 - Perception Analysis"]
                    }
                ]
            }
        },
        "0FK1I000000Dh6iWAC": {
            datasets: {
                "df17eadx__DTC_Opportunity_SAMPLE": [
                    {
                        fields: ["Product_Family"],
                        selection: ["Digital Media"]
                    }
                ]
            }
        },
    },
    
    update: function(component) {
        //console.warn('selectionTestHelper.update');
        
        var dashboardId = component.get('v.dashboardId') || '';
        var dataset = component.get('v.dataset') || '';
        var fields = component.get('v.fields') || null;
        var selection = component.get('v.selection') || [];
        var operator = component.get('v.operator') || 'in';
        var isFilter = component.get('v.isFilter') || false;
        
        var isString = selection.length < 1 ? true : false;
        selection.forEach(function(s) {
            if (typeof s === 'string') {
				isString = true;
            } 
        });
            

        var template = {datasets:{}};
        
        if (isFilter) {
            template.datasets[dataset] = [{
                fields: [fields],
                filter: {
                    operator: operator,
                    values: isString ? selection : [selection]
                }
            }];            
        } else {
            template.datasets[dataset] = [{
                fields: [fields],
                selection: selection
            }];            
        }
        
        var selectionJSON = JSON.stringify(template, null, 4);
        
        component.set('v.selectionJSON', selectionJSON);
    },
    
    getSelection: function(component) {
        return;
        
        var dashboardId = component.get('v.dashboardId');
        
        var selection = this.selections[dashboardId];
        if (typeof selection === 'undefined' || selection == null) {
            selection = this.selections['default'];
        }
        var selectionJSON = JSON.stringify(selection, null, 4);
        
        component.set('v.selectionJSON', selectionJSON);
    },
    
    showToast: function(component, title, message, type, key) {
        key = key || "chart";
        var toastEvent = $A.get("e.force:showToast");
        if (typeof toastEvent !== 'undefined' && toastEvent !== null) {            
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type,
                "key": key
            });
            toastEvent.fire();
        } else {
            alert(title + "\n\n" + message);
        }
    },    
})