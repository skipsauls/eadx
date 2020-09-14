({
	init: function(component, event, helper) {
		
	},
    
    handleOnMarksSelection: function(component, event, helper) {
        console.warn('handleOnMarksSelection');
        console.warn('params: ', event.getParams());
        
        let marks = event.getParam('marks');
        console.warn('marks: ', marks);
        
        let selection = {};

        helper.fireSelectionEvent(component, 'State', ['']);
        
        marks.forEach(function(mark) {
            console.warn('mark: ', mark);
            let pairs = mark.getPairs();
            pairs.forEach(function(pair) {
                console.warn('pair: ', pair.fieldName, pair.value, pair.formattedValue);
                selection[pair.fieldName] = selection[pair.fieldName] || [];
                selection[pair.fieldName].push(pair.value);
                /*
                if (pair.fieldName === 'State') {
                    helper.fireSelectionEvent(component, pair.fieldName, pair.value);
                }*/
            });
            for (var fieldName in selection) {
                if (fieldName === 'State') {
	                helper.fireSelectionEvent(component, fieldName, selection[fieldName]);
                }
            }
        });         
    },

    handleOnFilterChange: function(component, event, helper) {
        console.warn('handleOnFilterChange');
        console.warn('params: ', event.getParams());
        
        let filter = event.getParam('filter');
        console.warn('filter: ', filter);
        
        console.warn('worksheet: ', filter.getWorksheet());
        console.warn('filter type: ', filter.getFilterType());
        console.warn('field name: ', filter.getFieldName());
        //console.warn('applied values: ', filter.getAppliedValues());
        
        filter.getFieldAsync().then(function(field) {
            console.warn('field: ', field);
        });
        
    },

    handleOnParameterValueChange: function(component, event, helper) {
        console.warn('handleOnParameterValueChange');
        console.warn('params: ', event.getParams());
        
        let parameter = event.getParam('parameter');
        console.warn('parameter: ', parameter);
        
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params));
        //var id = params.id;
        //component.set("v.dashboardId", id);
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;
        
        
        if (payload) {                
	        let vizCmp = component.find('viz');
            
            let step = payload.step;
            console.warn("step: ", step);
            
            let data = payload.data;
            console.warn("data: ", data);
            
	        // Hardcoding for demo!
            if (payload.step === 'Profit_Ratio_Measure_1') {
	
                let filter = {};
                let values = {};
                data.forEach(function(obj) {
                    for (var k in obj) {
                        console.warn(k + ': ' + obj[k]);
                        // Adjust the values to match Tableau!!!
                        values[k] = obj[k] / 100;
                    }
                });
                
                filter = {'AGG(Profit Ratio)': values};
                
		        console.warn('filter: ', filter);
                
    	        vizCmp.applyFilter(filter);
                
            } else {
		        let selection = {};
                data.forEach(function(obj) {
                    for (var k in obj) {
                        console.warn(k + ': ' + obj[k]);
                        selection[k] = selection[k] || [];
                        selection[k].push(obj[k]);
                    }
                });
                
		        console.warn('selection: ', selection);
                
	            vizCmp.select(selection);                
            }       
            
        }
        
    }


})