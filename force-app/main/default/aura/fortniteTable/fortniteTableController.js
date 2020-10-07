({
    
	init: function(component, event, helper) {
        /*
		component.set('v.keyField', 'fieldName');
		component.set('v.columns', helper.columns);
		component.set('v.data', helper.data);
		component.set('v.selectedRows', helper.selectedRows);
        */
    },
    
    handleProxyReady: function(component, event, helper) {
        console.warn('handleProxyReady');
        helper.getListViews(component, function(err, listViews) {
            console.warn('getListViews: ', err, listViews);
            let listView = null;
            let developerName = component.get('v.developerName');
            listViews.forEach(function(lv) {
                console.warn('listView: ', lv);
                if (lv.developerName === developerName) {
                    listView = lv;
                }
            });
            console.warn('listView: ', listView);
            if (listView) {
                helper.describeListView(component, listView.id, function(err, listViewDescribe) {
                    console.warn('describeListView returned: ', err, JSON.parse(JSON.stringify(listViewDescribe)));
                    component.set('v.listViewDescribe', listViewDescribe);
                });
            }
        });
	},

    handleRefreshPlayers: function(component, event, helper) {
        var params = event.getParam('arguments');
        console.warn('fortniteTableController.handleRefreshPlayers: ', params);
        console.warn('params.callback: ', params.callback);
        helper.refreshListView(component, params.callback);
    },
    
    handleListViewDescribeChange: function(component, event, helper) {
        helper.refreshListView(component, function(err, res) {
            console.warn('refreshListView returned: ', err, res);
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
        
        component.set('v.selectedRows', selectedRows);
        
        
        return;
        
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