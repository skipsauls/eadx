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
    
    getListViews: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        let version = '50.0';
        
        let sobjectType = component.get('v.sobjectType');
        //console.warn('sobjectType: ', sobjectType);
        
        let url =  '/services/data/v' + version + '/sobjects/' + sobjectType + '/listviews';
        
        //console.warn('url: ', url);
        
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
        //console.warn('sobjectType: ', sobjectType);
        
        let url =  '/services/data/v' + version + '/sobjects/' + sobjectType + '/listviews/' + listViewId + '/describe';
        
        console.warn('url: '. url);
        
        let config = {
        };
        
        proxy.exec(url, 'GET', null, function(response) {
            //console.warn('response: ', response);
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
        query = query + ' LIMIT 500';
        console.warn('query: ', query);
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            let state = response.getState();
            //console.warn('state: ', state);
            let results = null;
            let err = null;
            if (state === "SUCCESS") {
                results = response.getReturnValue();
                //console.warn('results: ', results);		
            } else {
                err = {error: 'NO_RESULTS_FOUND', msg: 'No results found'};                
            }
            if (typeof callback === 'function') {
                callback(err, results);
            }
        }); 
        $A.enqueueAction(action);
    },

    handleSave: function(component, draftValues) {
        let self = this;
        console.warn('handleSave');
        console.warn('draftValues: ', draftValues);
        
        let keyField = component.get('v.keyField');
        
        let data = component.get('v.data');
        let recordsToUpdate = [];
        let record = null;
        data.forEach(function(r) {
            
            draftValues.forEach(function(v) {
                if (r[keyField] === v[keyField]) {
                    console.warn('matched record: ', r);
                    record = {};
                    record.Id = r.Id;
                    for (var k in v) {
                        record[k] = v[k];
                        r[k] = v[k];
                    }
                    recordsToUpdate.push(record);
                }
            });
        });
        
        console.warn('recordsToUpdate: ', recordsToUpdate);
        
        recordsToUpdate.forEach(function(r) {
            self.updateRecord(component, r, keyField, function(err, result) {
                console.warn('updateRecord returned: ', err, result);
            });
        });
        
        component.set('v.draftValues', []);
        
    },
    
    updateRecord: function(component, record, keyField, callback) {
        let action = component.get('c.updateRecord');
        action.setParams({record: record, keyField: keyField});
        action.setCallback(this, function(response) {
            let state = response.getState();
            console.warn('state: ', state);
            let results = null;
            let err = null;
            if (state === "SUCCESS") {
                results = response.getReturnValue();
                console.warn('results: ', results);		
            } else {
                err = {error: 'UPDATE_ERROR', msg: 'Update Error'};                
            }
            if (typeof callback === 'function') {
                callback(err, results);
            }
        }); 
        $A.enqueueAction(action);
        
    },
    
    handleDashboardStateChange: function(component) {
        let self = this;
        //console.warn('handleDashboardStateChange');
        let state = component.get('v.lastState');
        //console.warn('state: ', state);
        if (state !== null && typeof state !== 'undefined') {
            let datasets = state.state.datasets;
            let filters = null;
            let listFilter = {};
            let listFilters = [];
            //console.warn('datasets: ', datasets);
            for (var name in datasets) {
                filters = datasets[name];
                //console.warn('filters: ', filters);
                filters.forEach(function(filter) {
	                listFilter = {};
                    //console.warn('filter: ', filter);
                    filter.fields.forEach(function(field) {
                        //console.warn('field: ', field);
                        if (filter.filter.operator === 'in') {
	                        listFilter[field] = filter.filter.values;
                        } else {
                            // Others??
                        }
                    });
	                listFilters.push(listFilter);
                });
            }
            //console.warn('listFilters: ', listFilters);
            component.set('v.listFilters', listFilters);
        };
    },
    
    fieldNameMap: {
        'User.UniqueUserName': 'Owner.Name',
        'Type': 'Type',
        'Opportunity.Type': 'Type'
    },
    
    handleListFiltersChange: function(component) {
    	let self = this;
        let listFilters = component.get('v.listFilters');
        console.warn('handleListFiltersChange: ', listFilters);
      
        let listViewDescribe = component.get('v.listViewDescribe');
        
        let columns = listViewDescribe.columns;
        
        let columnName = null;
        
        let reset = true;

        let allData = component.get('v.allData');
        let data = [];
        let filteredData = [];
        
        allData.forEach(function(r) {
          	filteredData.push(r); 
        });
        
        listFilters.forEach(function(listFilter) {
            let fieldValues = null;
            for (var fieldName in listFilter) {
                fieldValues = listFilter[fieldName];
                //console.warn('fieldValues: ', fieldValues);
                if (fieldValues !== null && fieldValues.length > 0) {
                    reset = false;
                    //console.warn('fieldName: ', fieldName);
                    columnName = self.fieldNameMap[fieldName];
                    //console.warn('columnName: ', columnName);
                    
                    if (columnName !== null && typeof columnName !== 'undefined') {
                        let match = null;
                        
                        columns.forEach(function(column) {
                            console.warn('column.fieldNameOrPath: ', column.fieldNameOrPath);
                            if (column.fieldNameOrPath === columnName) {
                                match = column;
                            }   
                        });
                        
                        if (match !== null && fieldValues && fieldValues.length > 0) {
                            //console.warn('match: ', match);
                            //console.warn('fieldValues: ', fieldValues);
                            let flatFieldName = match.fieldNameOrPath.replace('.', '_');
                            let data = [];
                            filteredData.forEach(function(r) {
                                //if (fieldValues && fieldValues.length > 0) {
                                fieldValues.forEach(function(val) {
                                    //console.warn('val: ', val);
                                    //console.warn('r[' + flatFieldName + ']: ', r[flatFieldName]);
                                    if (val !== null && typeof val !== 'undefined' && r[flatFieldName] !== null && typeof r[flatFieldName] !== 'undefined') {
                                        //console.warn('findDiff for r[' + flatFieldName + ']: ', r[flatFieldName] + ' and val: '+ val + self.findDiff(r[flatFieldName], val).length);
	                                    //if (self.findDiff(r[flatFieldName], val).length < 3) {
    	                                //    data.push(r);
        	                            //
                                        if (r[flatFieldName].length === val.length && r[flatFieldName].indexOf(val) === 0) {
                                            data.push(r);
                                        }                             
                                    }
                                });
                                //}
                                
                            });
                            filteredData = data;
                            //component.set('v.data', data);
                        }
                    }
                }
            }
            
            component.set('v.data', filteredData);
        });

        //console.warn('reset: ', reset);
        if (reset === true) {
            //console.warn('resetting');
            // No filters, set to all data
            let allData = component.get('v.allData');
            //console.warn('setting to all data');
            component.set('v.data', allData);                
        }        
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