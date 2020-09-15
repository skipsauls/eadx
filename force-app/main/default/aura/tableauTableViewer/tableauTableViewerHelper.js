({
	showTable: function(component) {
       	let self = this;

        let table = component.get('v.asset');
        console.warn('table: ', table);

        return;
        
        self.getTableColumns(component, function(err, columns) {
            console.warn('columns: ', columns);
        });
        
	},
    
	getTableColumns: function(component, callback) {
       	let self = this;
        let table = component.get('v.asset');
        
        //let pageSize = component.get('v.pageSize');
        let methodName = 'get_table_columns';
        
        var proxy = component.find('proxy');
        
        
        let serverUrl = 'XXXXXXXX';
        let name = 'XXXXXXXX';
        let siteName = 'XXXXXXXX';
        
        let url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        
        url += '&tableName=' + table.name;
        url += '&serverUrl=' + serverUrl;
        url += '&siteName=' + siteName;  
        url += '&name=' + name;
        
        console.warn('url: ', url);
/*        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/apexrest/eadx/tableau?methodName=' + methodName;
        url += '&tableName=' + table.name;
*/
        
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                self.getTableColumns(component, callback);
            }, 500);
        } else {
        
            let spinner = component.find('result_spinner');
            $A.util.toggleClass(spinner, 'slds-hide');
            proxy.exec(url, 'GET', config, function(response) {
	            $A.util.toggleClass(spinner, 'slds-hide');
                let val = JSON.parse(response.body);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                } else {
                    return null;
                }            
            });
        }        

	}    
})