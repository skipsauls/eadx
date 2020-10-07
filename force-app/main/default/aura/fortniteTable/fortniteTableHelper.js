({
    columns: [
        { label: 'Field Name', fieldName: 'fieldName', type: 'text' },
        { label: 'ID', fieldName: 'id', type: 'text' },
        { label: 'Label', fieldName: 'label', type: 'text' }
    ],
    
    data: [
        { fieldName: 'firstName', id: '12345678', label: 'First Name'},
        { fieldName: 'lastName', id: '5678901', label: 'Last Name' },
        { fieldName: 'city', id: '452145', label: 'City' },
        { fieldName: 'state', id: '96828853', label: 'State' },
        { fieldName: 'lastAccessedDate', id: '32452345', label: 'Last Accessed Date' },
        { fieldName: 'firstCommit', id: '995902', label: 'First Commit' }
    ],
    
    selectedRows: [
        'lastName', 'state', 'firstCommit'
    ],
    
    typeMap: {
        'string': 'text'
    },
    
    refreshListView: function(component, callback) {
		let self = this;        
        let listViewDescribe = component.get('v.listViewDescribe');
        
        let columns = listViewDescribe.columns;
        let tableColumns = [];
        let tableColumn = null;
        columns.forEach(function(column) {
            console.warn('column: ', column);
            if (column.hidden !== true) {
                tableColumn = {
                    label: column.label,
                    fieldName: column.fieldNameOrPath,
                    type: self.typeMap[column.type] || 'text'
                };
	            console.warn('tableColumn: ', tableColumn);
                tableColumns.push(tableColumn);
            }
        });
        console.warn('tableColumns: ', tableColumns);
        component.set('v.columns', tableColumns);
        
        let query = listViewDescribe.query;
        console.warn('query: ', query);
        self.executeQuery(component, query, function(err, results) {
            console.warn('executeQuery returned: ', err, results);
            component.set('v.allData', results);
            component.set('v.data', results);
            
            if (typeof callback === 'function') {
                callback(null, {});
            }
        });
    },
    
    getListViews: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let version = '50.0';
        
        let sobjectType = component.get('v.sobjectType');
        console.warn('sobjectType: ', sobjectType);
        
        let url =  '/services/data/v' + version + '/sobjects/' + sobjectType + '/listviews';
        
        console.warn('url: ', url);
        
        proxy.exec(url, 'GET', null, function(response) {
            console.warn('response: ', response);
            let err= null;
            let results = null;
            let listViews = null;
            try {
             	results = response.body;
                listViews = results.listviews;
            } catch (e) {
                err = {error: 'NO_LISTVIEWS_FOUND', msg: 'No listviews found'};
            }
            if (typeof callback === 'function') {
                callback(err, listViews);
            }
        });        
    },
    
	describeListView: function(component, listViewId, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let version = '50.0';
        
        let sobjectType = component.get('v.sobjectType');
        console.warn('sobjectType: ', sobjectType);
        
        let url =  '/services/data/v' + version + '/sobjects/' + sobjectType + '/listviews/' + listViewId + '/describe';
        
        console.warn('url: '. url);
        
        let config = {
        };
        
        proxy.exec(url, 'GET', null, function(response) {
            console.warn('response: ', response);
            let listViewDescribe = null;
            let err = null;
            try {
                listViewDescribe = response.body;
            } catch (e) {
                err = {error: 'NO_DESCRIBE_FOUND', msg: 'No describe found'};
            }
            if (typeof callback === 'function') {
                callback(err, listViewDescribe);
            }
        });
	},
    
    executeQuery: function(component, query, callback) {
        let action = component.get('c.executeQuery');
        console.warn('action: ', action);
        query = query + ' LIMIT 100';
        console.warn('query: ', query);
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            let state = response.getState();
            console.warn('state: ', state);
            let results = null;
            let err = null;
            if (state === "SUCCESS") {
                results = response.getReturnValue();
                console.warn('results: ', results);		
            } else {
                err = {error: 'NO_RESULTS_FOUND', msg: 'No results found'};                
            }
            if (typeof callback === 'function') {
                callback(err, results);
            }
        }); 
        $A.enqueueAction(action);
    },
    
    findDiff: function(str1, str2) { 
        let diff= "";
        str2.split('').forEach(function(val, i){
            if (val != str1.charAt(i))
                diff += val ;         
        });
        
        return diff;
    },

    filterOnSelection: function(component, key, val) {
        let self = this;
    	console.warn('filterOnSelection', key, val);
        
        let listViewDescribe = component.get('v.listViewDescribe');
        
        let columns = listViewDescribe.columns;
        let match = null;
        
        columns.forEach(function(column) {
            if (column.fieldNameOrPath === key) {
                match = column;
            }   
        });
        
        if (match !== null) {
            console.warn('match: ', match);
            let allData = component.get('v.allData');
            let data = [];
            allData.forEach(function(r) {
                if (self.findDiff(r[key], val).length < 3) {
                    data.push(r);
                }
                /*
                if (r[key] === val) {
                    data.push(r);
                }
                */
            });
            component.set('v.data', data);
        }
        
    }
    
})