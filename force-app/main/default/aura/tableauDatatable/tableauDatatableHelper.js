({
    
    getViewData: function(component) {
        let view = component.get('v.view');
        
        if (view === null || typeof view === 'undefined') {
            return;
        }
        
        component.set("v.data", null);
        component.set("v.columns", null);
        
        let self = this;
        //let pageSize = component.get('v.pageSize');
        let methodName = 'get_view_data';
        
        var proxy = component.find('proxy');
        
        
        let serverUrl = 'us-west-2b.online.tableau.com';
        let name = 'ssauls@salesforce.com';
        //let siteName = 'einsteinsandbox';
        let siteName = 'eadx';
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        url += '&viewName=' + view.viewUrlName;
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;  
        url += '&name=' + name;        
        
        console.warn('url: ', url);

/*        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        url += '&viewName=' + view.viewUrlName;
*/
        
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getViewData(component);
            }, 500);
        } else {
            
            let spinner = component.find('spinner');
            $A.util.toggleClass(spinner, 'slds-hide');
            proxy.exec(url, 'GET', config, function(response) {
                let val = response.body;
                self.displayViewData(component, val, function() {
	                $A.util.toggleClass(spinner, 'slds-hide');                
                });
            });
        }        
        
    },

	// This expects CSV    
    displayViewData: function(component, results, callback) {

        console.warn('displayViewData results: ', results);
        
        if (results === null || typeof results === 'undefined') {

            if (typeof callback === 'function') {
                callback();
            }
            
        } else {
            
            console.warn('here');
            
            /*
            if (typeof results === 'string') {
                results = JSON.parse(results);
            } else {
                results = JSON.parse(JSON.stringify(results));
            }
            
            console.warn('results: ', results.length, results);
    */
            
            let labelRegEx = new RegExp('[^a-zA-Z0-9]', 'g');
            let spaceRegEx = new RegExp('\\s+', 'g');
            let csvRegEx = new RegExp(',(?=(?:(?:[^"]*"){2})*[^"]*$)', 'g');
            
            let rowData = results.split(new RegExp('\n', 'g'));
            let labelRow = rowData[0];
            let labels = labelRow.split(',');
            console.warn('labelRow: ', labelRow);
            console.warn('labels: ', labels);
            
            let firstRow = rowData[1];
            let cells = firstRow.split(csvRegEx);
            console.warn('firstRow: ', firstRow);
            console.warn('cells: ', cells);
            
            let names = [];
            let name = null;
            
            var typeAttributes = null;
            var cellAttributes = null;
            var cell = null;
            var val = null;
            var columns = [];
            
            labels.forEach(function(label, i) {
                name = label.trim().replace(labelRegEx, ' ');
                name = name.trim().replace(spaceRegEx, '_');
                //console.warn('name: ', name);
                names.push(name);
                
                val = cells[i];
                
                typeAttributes = {};
                cellAttributes = {};                
                cell = {
                    label: label,
                    fieldName: name,
                    type: typeof val,
                    sortable: true,
                    typeAttributes: typeAttributes,
                    cellAttributes: cellAttributes
                };
                columns.push(cell);
            });
      
            //console.warn('columns: ', columns);
            
            component.set("v.columns", columns);
            
            
            let data = [];
            let row = null;
            let rowObj = null;
            let cellObj = null;
            
            let max = Math.min(rowData.length, 200);
            
            for (var i = 1; i < max; i++) {
                row = rowData[i];
                //console.warn('row: ', row); 
                cells = row.split(csvRegEx);
                //console.warn('cells: ', cells);
                rowObj = {};
                cells.forEach(function(val, i) {
                    //console.warn('val: ', val);
                    name = names[i];
                    rowObj[name] = val;
                });
                data.push(rowObj);
            }
            
            component.set("v.data", data);
            
            if (typeof callback === 'function') {
                callback();
            }
        }
    },
    
    // This one expects a JSON response...
    OLD_displayViewData: function(component, results, callback) {
        
        if (typeof result === 'string') {
            results = JSON.parse(results);
        } else {
            results = JSON.parse(JSON.stringify(results));
        }
        
        console.warn('results: ', results.length, results);
        
        var sortDirection = component.get('v.sortedDirection');
        var fieldMap = component.get("v.fieldMap") || {};
        var field = null;
        var type = null;
        var typeAttributes = null;
        var cellAttributes = null;
        var cell = null;
        var label = null;
        var name = null;
        var exp = new RegExp('\\.', 'g');
        
        // Create the column headers
        var columns = [];
        
        var row = results[0];
        var cell = null;
        var val = null;
        
        for (var key in row) {
            val = row[key];
            typeAttributes = {};
            cellAttributes = {};                
            cell = {
                label: key,
                fieldName: key,
                type: typeof val,
                sortable: true,
                typeAttributes: typeAttributes,
                cellAttributes: cellAttributes
            };
            columns.push(cell);
        }
        
        component.set("v.columns", columns);
        component.set("v.data", results);
        
        if (typeof callback === 'function') {
            callback();
        }
        
    }
    
})