({    
    handleCommanderPayload: function(component, payload, callback) {
      	let self = this;
        let action = payload.action;
        let response = payload.response;
        let parameters = payload.parameters;
        
        let commandTarget = action.commandTarget;
        
        let actionResults = response.actionResults;
        
        //console.warn('handleCommanderPayload: ', commandTarget, actionResults);
        
        actionResults.forEach(function(actionResult) {
            let outputValues = actionResult.outputValues;
            
            if (outputValues.aliasName) {
                let aliasName = outputValues.aliasName;
                let query = outputValues.query;
                let max = outputValues.max;
             	
                self.listAnalyticsNotifications(component, function(err, notifications) {
                    if (err) {
                        console.error('listAnalyticsNofications error: ', err);
                    } else {
                        let best = 1000000;
                        let bestIdx = 0;
                        let ld = null;
                        let last = null;                        
                        notifications.forEach(function(notification, idx) {
                            ld = self.levenshteinenator(aliasName, notification.name);
                            last = ld[ld.length - 1];
                            if (last[last.length - 1] < best) {
                                best = last[last.length - 1];
                                bestIdx = idx;
                            }
                        });
                        let bestMatch = notifications[bestIdx];
                        
                        if (bestMatch) {
                            let configuration = bestMatch.configuration;
                            let query = configuration.query;
                            self.execute(component, bestMatch, function(err, results) {
                                //console.warn('execute returned: ', err, results);
                                
                                let resultsObj = JSON.parse(results);
                                //console.warn('resultsObj: ', resultsObj);
                                let records = resultsObj.results.records;
                                console.warn('records: ', records);
                                
                                self.getCommanderTemplate(component, bestMatch.name, function(err, template) {
                                    console.warn('getCommanderTemplate returned: ', err, template);
                                    
                                    let value = null;
                                    let result = '';
                                    // Note that this tries to extract the sum_Amount as the default
                                    let partial = template ? template.eadx__Template__c : '${{sum_Amount}}';
                                    let regex = null;
                                    let sep = ' ';
                                    let idx = 0;
                                    records.forEach(function(record) {
                                        
                                        partial = template ? template.eadx__Template__c : '${{sum_Amount}}';

                                        
                                        console.warn('record: ', record);
                                        for (var key in record) {
                                            

                                            value = record[key];
                                            console.warn(key, ' = ', value);
                                            regex = new RegExp('{{' + key + '}}');
                                            
                                            
                                            partial = partial.replace(regex, value);
                                            
                                        }
                                        idx++;
                                        result += sep + partial;
                                        sep = idx < records.length - 1 ? ', ' : ', and ';
                                    });

                                    //console.warn('result: ', result);
                                    result = result.trim();
                                    result = result.substring(0, 1).toUpperCase() + result.substring(1);
                                    if (result.substring(result.length - 1) !== '.') {
	                                    result += '.';                                    
                                    }
                                    
                                    //console.warn('result: ', result);
                                    
                                    let resp = {
                                        outputValues: {
	                                        speech: result,
    	                                    text: result                                    
                                        }
                                    };
                                    
                                    if (typeof callback === 'function') {
                                        callback(err, resp);
                                    }
                                    
                                });                                    

                            });   
                        }
                    }
                });
            }
        });
        
    },
    
    getDataset: function(component, datasetId, callback) {
        let self = this;
        
        let proxy = component.get('v.proxy');
        
        let version = '47.0';
        let url = '/services/data/v' + version + '/wave/datasets/' + datasetId;
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        
        proxy.exec(url, 'GET', body, function(response) {
            let dataset = response.body;
            if (typeof callback === 'function') {
                callback(null, dataset);
            }
        });
    },

    
    describeDataset: function(component, dataset, callback) {
        let self = this;
        
        let proxy = component.get('v.proxy');
        
        let url = dataset.currentVersionUrl;
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        
        proxy.exec(url, 'GET', body, function(response) {
            let details = response.body;
            if (typeof callback === 'function') {
                callback(null, details);
            }
        });
    },
    
    execute: function(component, alias, callback) {
        let self = this;
        
        //console.warn('execute: ', alias);
        //console.warn('name: ', alias.name);
        
        let query = alias.configuration.query;
        
        //console.warn('query: ', query);
        
        let datasets = alias.configuration.datasets;
        
        let count = datasets.length;
        
        datasets.forEach(function(d) {
            //console.warn('d: ', d);
            self.getDataset(component, d.id, function(err, dataset) {
                //console.warn('dataset: ', dataset);
                self.describeDataset(component, dataset, function(err, datasetDetails) {
	                //console.warn('datasetDetails: ', datasetDetails);

                    let devName = (dataset.namespace ? dataset.namespace + '__' : '') + dataset.name;
                    //console.warn('devName: ', devName);
                    let exp = new RegExp(devName, 'g');
                    //console.warn('exp: ', exp);
                    query = query.replace(exp, dataset.id + '/' + dataset.currentVersionId);
                    //console.warn('query: ', query);
                    if (--count === 0) {
                        self.executeQuery(component, query, callback);
                    }
                });
            });
            /*
            self.describeDataset(component, d.id, $A.getCallback(function(err, dataset) {
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
            }));
            */
        });

    },
         
    getCommanderTemplate: function(component, assetName, callback) {
        let self = this;
        
        let proxy = component.get('v.proxy');

        let query = "SELECT+Id,eadx__AssetName__c,eadx__Template__c,eadx__Type__c+FROM+eadx__CommanderTemplate__c+WHERE+eadx__AssetName__c+=+'" + assetName + "'+AND+eadx__Type__c+=+'VoiceAlias'+LIMIT+1";

        //console.warn('query: ', query);
        
        let version = '47.0';
        let url = '/services/data/v' + version + '/query?q=' + query;
        
        //console.warn('url: '. url);
        
        let config = {
        };
        
        proxy.exec(url, 'GET', null, function(response) {
            //console.warn('response: ', response);
            let template = null;
            let err = null;
            try {
                let results = response.body;
                let records = results.records;
                template = records[0];
            } catch (e) {
                err = {error: 'NO_TEMPLATE_FOUND', msg: 'No template found'};
            }
            if (typeof callback === 'function') {
                callback(err, template);
            }
        });
    },

    executeQuery: function(component, query, callback) {

        //console.warn('query: ', query);
        
        let self = this;
        
        let proxy = component.get('v.proxy');
        
        let version = '47.0';
        let url = '/services/data/v' + version + '/wave/query';
        
        let config = {
            query: query
        };
        
        let body = JSON.stringify(config);
        //console.warn('calling POST on url: ', url, ' with body: ', body);
        
        proxy.exec(url, 'POST', body, function(response) {
            //console.warn('response: ', response);
            let results = response.body;
            if (typeof callback === 'function') {
                callback(null, results);
            }
        });
    },    
    
    listAnalyticsNotifications: function(component, callback) {        
        let self = this;
        
        let proxy = component.get('v.proxy');
        
        let version = '47.0';
        let url = '/services/data/v' + version + '/analytics/notifications?source=waveNotification';
        
        let config = {
        };
        
        let body = JSON.stringify(config);
        
        proxy.exec(url, 'GET', body, function(response) {
            let notifications = response.body;
            if (typeof callback === 'function') {
                callback(null, notifications);
            }
        });
    },    
    
    levenshteinenator: function(a, b) {
        var self = this;
        var cost;
        var m = a.length;
        var n = b.length;
        
        // make sure a.length >= b.length to use O(min(n,m)) space, whatever that is
        if (m < n) {
            var c = a; a = b; b = c;
            var o = m; m = n; n = o;
        }
        
        var r = []; r[0] = [];
        for (var c = 0; c < n + 1; ++c) {
            r[0][c] = c;
        }
        
        for (var i = 1; i < m + 1; ++i) {
            r[i] = []; r[i][0] = i;
            for ( var j = 1; j < n + 1; ++j ) {
                cost = a.charAt( i - 1 ) === b.charAt( j - 1 ) ? 0 : 1;
                r[i][j] = self.minimator( r[i-1][j] + 1, r[i][j-1] + 1, r[i-1][j-1] + cost );
            }
        }
        
        return r;
    },
    
    minimator: function(x, y, z) {
        if (x <= y && x <= z) return x;
        if (y <= x && y <= z) return y;
        return z;
    }
    
})