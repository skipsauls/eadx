({
    columns: [
        {
            label: 'Title',
            fieldName: 'label',
            type: 'string',
            sortable: true
        },
        {
            label: 'Description',
            fieldName: 'description',
            type: 'string',
            sortable: true
        },
        {
            label: 'Created By',
            fieldName: 'createdBy_name',
            type: 'string',
            sortable: true,
            cellAttributes: {
            }
        },
        {
            label: 'Created On',
            fieldName: 'createdDate',
            type: 'date',
            sortable: true,
            cellAttributes: {
            }
        },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    {
                        label: 'Open',
                        name: 'open'
                    }
                ]
            }
        }
    ],
    
    setup: function(component) {
        var self = this;
        
        component.set('v.columns', self.columns);        
        
        self.listFolders(component, {}, function(err, folders) {
            console.warn('listFolders returned: ', err, folders);
        	component.set('v.folders', folders);
            var data = [];
            var item = null;
            var flatKey = null;
            var val = null;
            folders.forEach(function(folder) {
                item = {};
                for (var key in folder) {
                    val = folder[key];
                    if (typeof val === 'object') {
	                    flatKey = key;
                        for (var k in val) {
                            item[flatKey + '_' + k] = val[k];
                        }
                    } else {
                        item[key] = val;
                    }
                }
                data.push(item);
            });
            console.warn('data: ', data);
            component.set('v.data', data);
        });
    },
    
    listFolders: function(component, methodParameters, callback) {
        var self = this;
        var sdk = component.find('sdk');
        
        var context = {apiVersion: '43'};        
        var methodName = 'listFolders';
        
        
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error(methodName + ' error: ', err);
                if (typeof callback === 'function') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (typeof callback === 'function') {
                    callback(null, data.folders);
                } else {
                    return data.folders;
                }
            }
        }));        
    },
    
    createApp: function(component) {
        console.warn('tempalateManagerHelper.createApp');
        var launcher = component.find('launcher');
        var flowName = component.get('v.flowName');
        var inputVariables = component.get('v.inputVariables');
        var title = component.get('v.title');
        launcher.launch(flowName, inputVariables, true, title, function() {});        
    },
    
    sortData: function (component, fieldName, sortDirection) {
        var data = component.get("v.data");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        component.set("v.data", data);
    },
    
    sortBy: function (field, reverse, primer) {
        var key = primer ? function(x) {return primer(x[field])} :
        function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
    
})