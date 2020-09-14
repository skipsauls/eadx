({
        aliasColumns: [
        {label: 'Name', fieldName: 'name', type: 'text'},
        {label: 'Id', fieldName: 'id', type: 'string'},
        {label: 'Record Id', fieldName: 'recordId', type: 'text'},
        {label: 'Created', fieldName: 'createdDate', type: 'date'},
        {label: 'Modified', fieldName: 'lastModifiedDate', type: 'date'},
        {type: 'action',
         typeAttributes: {
             rowActions: [
                 {label: 'Execute', name: 'execute'}
             ]
         }
        }
    ],
    
    listAliases: function(component, callback) {
        var self = this;
        var proxy = component.find('proxy');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        var url = '/services/data/v46.0/analytics/notifications?source=waveNotification';
        var config = null;
        
        if (proxy.get('v.ready') !== true) {
            setTimeout($A.getCallback(function() {
                self.listAliases(component, callback);
            }), 500);
        } else {
        
            proxy.exec(url, 'GET', config, function(response) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, response.body);
                } else {
                    return null;
                }            
            });
        }
    },
    
    prettifySAQL: function(query) {        
     	let lines = query.split(';');
        let pretty = '';
        lines.forEach(function(line) {
            line = line.trim();
            if (line.length > 0) {
	           	pretty += line.trim() + ';\n';
            }
        });
        return pretty;
    },
    
    getAliasDetails: function(component, alias) {
        let self = this;
        console.warn('getAliasDetails: ', alias);
        component.set('v.alias', alias);
        component.set('v.aliasJson', JSON.stringify(alias, null, 2));
        let query = alias.configuration.query;
        //let regex = new RegExp('\;', 'g');
        //query = query.replace(regex, '\n');
        query = self.prettifySAQL(query);
        component.set('v.aliasQuery', query);
    },

    getDatasetByName: function(component, name, callback) {
        
        var sdk = component.find('sdk');
        var context = {apiVersion: "46"};
        var methodName = 'listDatasets';
        var methodParameters = {
            q: name
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    let dataset = null;
                    data.datasets.forEach(function(d) {
                        if (d.name === name ) {
                            dataset = d;
                        }
                    });
                    callback(null, dataset);
                } else {
                    return data;
                }
            }
        }));
    },
    
    describeDataset: function(component, datasetId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "46"};
        var methodName = "describeDataset";
        var methodParameters = {
            datasetId: datasetId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            console.warn('describeDataset returned: ', err, data);
            if (err !== null) {
                console.error("describeDataset error: ", err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, data);
                } else {
                    return data;
                }
            }
        }));
    },
    
    execute: function(component, alias, callback) {
        var self = this;
        
        console.warn('execute: ', alias.name);
        
        let query = alias.configuration.query;
        
        console.warn('query: ', query);
        
        let datasets = alias.configuration.datasets;
        
        let count = datasets.length;
        
        datasets.forEach(function(d) {
            self.describeDataset(component, d.id, function(err, dataset) {
                console.warn('dataset: ', dataset);
                let devName = (dataset.namespace ? dataset.namespace + '__' : '') + dataset.name;
                console.warn('devName: ', devName);
                let exp = new RegExp(devName, 'g');
                console.warn('exp: ', exp);
                query = query.replace(exp, dataset.id + '/' + dataset.currentVersionId);
		        console.warn('query: ', query);
                if (--count === 0) {
                    self.executeQuery(component, query, callback);
                }
            });
        });

    },
         
    
    executeQuery: function(component, query, callback) {

        console.warn('query: ', query);
        
        var sdk = component.find('sdk');
        
        var context = {apiVersion: '46'};
        
        var methodName = 'executeQuery';
        
		// q = group q by all;        
        
        var methodParameters = {
            query: query
        };
        
        console.warn('methodParameters: ', methodParameters);
        console.warn('json: ', JSON.stringify(methodParameters, null, 2));
        
        console.warn('sdk.invokeMethod: ', context, methodName, methodParameters);
        
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            console.warn('invokeMethod returned: ', err, data);
            if (err !== null) {
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                } else {
                    return err;
                }
            } else {
                let resp = JSON.parse(data);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, resp.results);
                } else {
                    return data;
                }
            }
        }));        
    }
    
})