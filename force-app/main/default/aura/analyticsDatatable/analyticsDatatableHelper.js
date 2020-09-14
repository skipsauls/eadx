({
    // Maps EA types to those for lightning:datatable
    typeMap: {
        "dimension": "text",
        "measure": "number",
        "numeric": "number",
        "date": "date"
    },
    
    handleSAQLChange: function(component) {
        var saql = component.get("v.saql");
        component.set("v.columns", null);
        component.set("v.data", null);
        var datatable = component.find("datatable");
        var self = this;
        if (saql !== null && typeof saql !== 'undefined') {
            
            var spinner = component.find("spinner");
            $A.util.removeClass(spinner, "slds-hide");
            
            self.execQuery(component, saql, function(err, result) {
                if (err) {
                    console.error('Query error: ', err[0]);
                    component.set("v.columns", null);
                    component.set("v.data", null);                   
                    $A.util.removeClass(spinner, "slds-hide");
                    return;
                }
                
                if (typeof result === 'string') {
                    result = JSON.parse(result);
                } else {
                    result = result;
                }
                
                console.warn('result: ', result);
                
                var records = result.results.records;                
                var sortDirection = component.get('v.sortedDirection');
                var fieldMap = component.get("v.fieldMap") || {};
                var field = null;
                var type = null;
                var typeAttributes = null;
                var cellAttributes = null;
                var cell = null;
                var label = null;
                var name = null;
                var exp = new RegExp('\\.', 'g');
                
                // Create the column headers
                var columns = [];
                result.results.metadata[0].lineage.projections.forEach(function(projection) {
                    console.warn('projection: ', projection);
                    typeAttributes = {};
                    cellAttributes = {};
                    
                    field = projection.field;
                    
                    label = field.id.replace('q.', '');
                    name = field.id.replace('q.', '');
                    type = self.typeMap[field.type] || 'string';
                    
                    /*
                    field = fieldMap[col.name];
                    if (field !== null && typeof field !== 'undefined') {                        
                        type = self.typeMap[field.type] || 'string';
                        if (type === 'number') {
                            if (field.measure && field.measure.format && field.measure.format.decimalDigits) {
                                typeAttributes.maximumFractionDigits = field.measure.format.decimalDigits;
                                typeAttributes.minimumFractionDigits = field.measure.format.decimalDigits;
                            }
                        }
                        
                        label = field[field.type] ? field[field.type].label : col.name;
                        name = field[field.type] ? field[field.type].fullyQualifiedName || field[field.type].name : col.name;
                        
                    } else {
                        label = col.name;
                        name = col.name;
                        type = self.typeMap[col.type] || 'string';
                    }
                    */
                    
                    cellAttributes.class = 'cell ' + name.replace(exp, '_').toLowerCase();
                    
                    cell = {
                        label: label,
                        fieldName: name,
                        type: type,
                        sortable: true,
                        typeAttributes: typeAttributes,
                        cellAttributes: cellAttributes
                    };
                    
                    console.warn('cell: ', cell);
                    
                    columns.push(cell);
                    
                });
                component.set("v.columns", columns);
                component.set("v.data", records);

	            var spinner = component.find("spinner");                
                $A.util.addClass(spinner, "slds-hide");
                
            });
        }
        
    },
    
    
    execQueryOld: function(component, query, callback) {
        var action = component.get("c.execQuery");
        var self = this;
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(null, val);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var err = response.getError();
                console.error('error: ', err);
                if (callback !== null && typeof callback !== 'undefined') {
                    callback(err, null);
                }
            }            
        });
        $A.enqueueAction(action);
    },    
    
    execQuery: function(component, query, callback) {
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
                    callback(null, resp);
                } else {
                    return data;
                }
            }
        }));
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