({
    handleUpload: function(component, event, helper) {
        console.warn('handleUpload');
      	helper.uploadViewData(component);
    },
    
	handleViewChange: function(component, event, helper) {

        helper.getWorkbookData(component, function(err, workbook) {
	        helper.createShareURL(component, workbook);
        });
        

        //helper.getViewData(component);
        
	},

    handleOnMarksSelection: function(component, event, helper) {
        console.warn('handleOnMarksSelection');
        console.warn('params: ', event.getParams());
        
        let marks = event.getParam('marks');
        console.warn('marks: ', marks);
        
        marks.forEach(function(mark) {
            console.warn('mark: ', mark);
            let pairs = mark.getPairs();
            pairs.forEach(function(pair) {
                console.warn('pair: ', pair.fieldName, pair.value, pair.formattedValue);
            });
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
    
	handleMarksChange: function(component, event, helper) {
        console.warn('handleMarksChange');
        let marks = component.get('v.marks');
        console.warn('marks: ', marks);
        
    },
    
	getMarks: function(component, event, helper) {
        console.warn('getMarks');
        //let marks = component.get('v.marks');
        //console.warn('marks: ', marks);

        let vizCmp = component.find('viz');
        console.warn('vizCmp: ', vizCmp);

        vizCmp.getSelectedMarksAsync(function(err, marks) {

            console.warn('vizCmp.getSelectedMarksAsync returned marks: ', marks);

        });
/*
        vizCmp.selectedMarksAsync(function(err, marks) {

            console.warn('vizCmp.selectedMarksAsync returned marks: ', marks);

        });            
*/            
      return;
        marks.forEach(function(mark) {
            console.warn('mark: ', mark);
            let pairs = mark.getPairs();
            console.warn('pairs: ', pairs);
            pairs.forEach(function(pair) {
                console.warn('pair: ', pair);
                console.warn(pair.fieldName);
                console.warn(pair.value);
                console.warn(pair.formattedValue);
            });
        });        

    },
    
    handleToolbarAction: function(component, event, helper) {
        let toolbarAction = component.get('v.toolbarAction');
        if (toolbarAction === 'upload') {
          	helper.uploadViewData(component);
        }
        component.set('v.toolbarAction', null);
    }
})