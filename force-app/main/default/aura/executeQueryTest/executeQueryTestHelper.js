({
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
    
    executeQuery: function(component, query, callback) {
        var sdk = component.find('sdk');
        var context = {apiVersion: '46'};
        var methodName = 'executeQuery';
        var methodParameters = {
            query: query
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
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