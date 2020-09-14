({
    showKPI: function(component) {
        var self = this;
        self.execQuery(component, function(err, results) {
            self.handleKPIChange(component);
        });        
    },
    
    handleKPIChange: function(component) {
        var kpi = component.get('v.kpiName');
        var kpiFormat = component.get('v.kpiFormat');
        var kpiDecimalDigits = component.get('v.kpiDecimalDigits');
        
        if (kpi !== null && typeof kpi !== 'undefined') {

            var records = component.get('v.records');
            if (records && records.length > 0) {
                component.set('v.count', records.length);
                var index = component.get('v.index');
                //component.set('v.index', 0);
	            var value = records[index][kpi];
                if (kpiFormat) {
                    try {
                        kpiFormat = JSON.parse(kpiFormat);
                        var fs = kpiFormat[0];
                        var d = kpiDecimalDigits || kpiFormat[1] || 0;
                        if (d > 0) {
                            var a = new Array(2);
                            a.fill(0);
                            a = a.join();
                            a = a.replace(new RegExp(',','g'), '');
                            fs = a ? fs + '.' + a : fs;
                        }
                        value = format(fs, value);                        
                    } catch (e) {}
                }
    	        component.set('v.value', value);                
            }
        }
	},

    execQuery: function(component, callback) {
        var query = component.get('v.saql');
        if (typeof query !== 'undefined' && query !== null) {
            query = query.replace(new RegExp('\\"', 'g'), '"');
            var action = component.get("c.execQuery");
            var self = this;
            action.setParams({query: query});
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var json = response.getReturnValue();
                    var val = JSON.parse(json);
                    var t2 = Date.now();
                    if (val.results) {
                        if (val.results.metadata) {
                            val.results.metadata.forEach(function(metadata) {
								if (metadata.columns) {
                            		component.set('v.columns', metadata.columns);
                               	} 
                            });
                        }
                        if (val.results.records) {
                            component.set('v.records', val.results.records);
                        }
                    }

                    if (typeof callback === 'function') {
                        callback(err, val.results);
                    }
                }
                else if (state === "INCOMPLETE") {
                    // do something
                } else if (state === "ERROR") {
                    var err = response.getError();
                    //console.error('error: ', err);
                    if (typeof callback === 'function') {
                        callback(err, null);
                    }
                }            
            });
            $A.enqueueAction(action);            
        }
    }
})