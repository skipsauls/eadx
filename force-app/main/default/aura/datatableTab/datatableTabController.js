({
    
	init: function(component, event, helper) {
        /*
		component.set('v.keyField', 'fieldName');
		component.set('v.columns', helper.columns);
		component.set('v.data', helper.data);
		component.set('v.selectedRows', helper.selectedRows);
        */
        
        setInterval($A.getCallback(function() {
            console.warn('checking state');
            let config = {};
            let dashboard = component.find('dashboard');
            if (dashboard.get('v.isLoaded') === true) {
                dashboard.getState(config, function(res, err) {
                    //console.warn('getState returned: ', JSON.stringify(res.payload, null, 2));
                    let lastState = component.get('v.lastState');
                    
                    if (lastState === null) {
                        component.set('v.lastState', res.payload);
                    } else if (JSON.stringify(lastState) !== JSON.stringify(res.payload)) {
                        //console.warn('>>>>>>>>>>>>>>>> dashboard state changed');
                        //console.warn('lastState: ', JSON.parse(JSON.stringify(lastState)));
                        //console.warn('currrentState: ', JSON.parse(JSON.stringify(res.payload)));
	                    component.set('v.lastState', res.payload);
                    }
                    
                });
            }

        }), 1000);

    },
    
    handleDashboardStateChange: function(component, event, helper) {
        helper.handleDashboardStateChange(component);
    },

    handleListFiltersChange: function(component, event, helper) {
        helper.handleListFiltersChange(component);
    },

    handleSave: function(component, event, helper) {
        console.warn('helper.handleSave');
        let draftValues = event.getParam('draftValues');
        helper.handleSave(component, draftValues);
    },
    
    handleProxyReady: function(component, event, helper) {
        //console.warn('handleProxyReady');
        helper.getListViews(component, function(err, listViews) {
            //console.warn('getListViews: ', err, listViews);
            let listView = null;
            let developerName = component.get('v.developerName');
            listViews.forEach(function(lv) {
                //console.warn('listView: ', lv);
                if (lv.developerName === developerName) {
                    listView = lv;
                }
            });
            //console.warn('listView: ', listView);
            if (listView) {
                helper.describeListView(component, listView.id, function(err, listViewDescribe) {
                    //console.warn('describeListView returned: ', err, JSON.parse(JSON.stringify(listViewDescribe)));
                    component.set('v.listViewDescribe', listViewDescribe);
                });
            }
        });
	},

    handleListViewDescribeChange: function(component, event, helper) {
        let listViewDescribe = component.get('v.listViewDescribe');
        
        let columns = listViewDescribe.columns;
        let tableColumns = [];
        let tableColumn = null;
        columns.forEach(function(column) {
            //console.warn('column: ', column);
            if (column.hidden !== true) {
                tableColumn = {
                    label: column.label,
                    fieldName: column.fieldNameOrPath.replace('.', '_'),
                    type: helper.typeMap[column.type] || 'text',
                    editable: true
                };
	            //console.warn('tableColumn: ', tableColumn);
                tableColumns.push(tableColumn);
            }
        });
        //console.warn('tableColumns: ', tableColumns);
        component.set('v.columns', tableColumns);
        
        let query = listViewDescribe.query;
        //console.warn('query: ', query);
        helper.executeQuery(component, query, function(err, results) {
            //console.warn('executeQuery returned: ', err, results);
            if (err) {
                
            } else {
                // Flatten the fields
                results.forEach(function(record) {
                    for (var key in record) {
                        let val = record[key];
                        if (typeof val === 'object') {
                            for (var key2 in val) {
                                record[key + '_' + key2] = val[key2];
                            }
                        }
                    }
                });
	            component.set('v.allData', results);
    	        component.set('v.data', results);
            }
        });
        
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params));
        var id = params.id;
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;        
        if (payload) {                
            var step = payload.step;
            console.warn("step: ", step);
            var data = payload.data;
            console.warn("data: ", data);
            var idx = 0;
            data.forEach(function(obj) {
                console.warn('obj: ', obj);
                for (var k in obj) {
	                console.warn(k + ': ' + obj[k]);
                    helper.filterOnSelection(component, k, obj[k]);
                }
            });
        }
    },
    
    handleSearchTermChange: function(component, event, helper) {
     	let searchTerm = component.get('v.searchTerm');
        let data = component.get('v.data');
        let selectedRows = component.get('v.selectedRows');
        data.forEach(function(item) {
            item.fieldName = item.fieldName.replace('_hidden', '');
            if (item.fieldName.indexOf(searchTerm) >= 0) {
                
            } else {
                item.fieldName = item.fieldName + '_hidden';
            }            
        });
        component.set('v.data', data);
        component.set('v.selectedRows', selectedRows);
    },
    
    handleRowSelection: function(component, event, helper) {
        console.warn('handleRowSelection');
        let selectedRows = event.getParam('selectedRows');
        selectedRows.forEach(function(selectedRow) {
            console.warn('selectedRow: ', selectedRow); 
        });
        let currentSelectedRows = component.get('v.selectedRows');
        currentSelectedRows.forEach(function(name) {
            console.warn('name: ', name);
        });
        
        return;
        let newSelectedRows = [];
        let data = component.get('v.data');
        let dataMap = {};
        let fieldName = null;
        data.forEach(function(item) {
            if (item.fieldName.indexOf('_hidden') >= 0) {
                fieldName = item.fieldName.replace('_hidden', '');
                console.warn('fieldName: ', fieldName);
                currentSelectedRows.forEach(function(name) {
                    console.warn('name: ', name);
                    if (name === fieldName) {
                        newSelectedRows.push(fieldName + '_hidden');
                    }
                });
            } else {
                fieldName = item.fieldName;
                console.warn('fieldName: ', fieldName);
                selectedRows.forEach(function(name) {
                    console.warn('name: ', name);
                    if (name === fieldName) {
                        newSelectedRows.push(fieldName);
                    }
                });
            }
        });
        
        component.set('v.selectedRows', newSelectedRows);
    }
})