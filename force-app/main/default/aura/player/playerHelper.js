({
    setup: function(component) {
        var self = this;
        /*
        var interval = setInterval(function(cmp) {
            self.cleanup(cmp);
        }, 1000, component);
        comonent.set("v.interval", interval);
        */
    },
    
    cleanup: function(component) {
        //console.warn('cleanup: ', component);
        var cleaned = component.get("v.eventsCleaned");
        if (cleaned === true) {
            return;
        } else {
            var t1 = Date.now();
            this.clean(component, function() {
                var t2 = Date.now();
                console.warn('clean done, timing: ', (t2 - t1) + ' ms'); 
            });
        }
    },
    
    discover: function(component, event) {
        var evt = $A.get('e.wave:discover');
        evt.setParams({});
        evt.fire();
    },

    handleDiscoverResponse: function(component, event) {
        var params = event.getParams();
        console.warn('handleDiscoverResponse: ', params);
        var ids = component.get("v.ids");
        ids.push(params.id);
        
        // Get the cached details, don't call for those that we already know
        // Need to check if info is stale?

        ids.forEach(function(id) {
            console.warn('id: ', id);
            self.getDashboardDetails(component, id, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
                console.warn('getDashboardDetails returned: ', err, dashboard, datasets, datasetsMap, datasetFieldsMap);
                console.warn('dashboard: ', dashboard);
                console.warn('datasets: ', datasets);
                console.warn('datasetsMap: ', datasetsMap);
                console.warn('datasetFieldsMap: ', datasetFieldsMap);
                
                var step = dashboard.state.steps[event.step];
                console.warn('step: ', step);
                if (step.datasets && step.datasets.length > 0) {
                    var dataset = step.datasets[0];
                    console.warn('dataset: ', dataset);
                    console.warn('dataset id: ', dataset.id);
                    var datasetName = (dataset.namespace ? dataset.namespace + '__' : '') + dataset.name;
                    console.warn('----------------------------------------> datasetName: ', datasetName);                    
                } else {
                    console.warn('----------------------------------------> step does not have a dataset, clean!!!');
                }
            });
            
        });        
    },
    
    snapshot: function(component, event) {
		console.warn('playerHelper.snapshot');
        //var name = component.get("v.name");
        var names = component.get("v.names");
        var events = component.get("v.events");
        var name = events && events.length > 0 ? events[0].name : '';
		var name = prompt("Please enter a name for the Snapshot", name);
        console.warn("name: ", name, typeof name);
        if (name === null || typeof name === "undefined" || name === "") {
            return;
        } else {
                
            var found = false;
            names.forEach(function(n) {
                if (n === name) {
                    found = true;
                }
            });
            if (found === false) {
                names.push(name);
            }
            component.set("v.names", names);
            component.set("v.name", name);
            
            var events = component.get("v.events");
            events.forEach(function(e) {
               e.name = name; 
            });
            component.set("v.events", events);
            
            this.storeSnapshot(component);
        }
    },

    handleSelectionChanged: function(component, event) {
        console.warn('handleSelectionChanged');
        var timestamp = Date.now();
        var self = this;
        var params = event.getParams();
        console.warn('params: ', params);
        console.warn('json: ', JSON.stringify(params, null, 2));
        
        if (params.verb === 'selection' && params.noun === 'dashboard') {
            
        }
        
        for (var k in params) {
            console.warn('param ', k, ': ', params[k]);
        }
        
        var id = params.id;
        
        var payload = params.payload;
        console.warn("payload: ", payload);
        var row = null;
        
        if (payload) {                
            var step = payload.step;
            var data = payload.data;
            console.warn("data: ", data);
            var idx = 0;
            
            var fieldKeys = {};
            var fields = [];
            var selection = [];
            
            data.forEach(function(obj) {
                for (var k in obj) {
                    console.warn('data - ', k, ': ', obj[k]);
                    if (k !== 'count' && k !== 'order') {
                        fieldKeys[k] = 1;
                        selection.push(obj[k]);                
                    }
                }
            });
            
            Object.keys(fieldKeys).forEach(function(k){
                console.warn('k: ', k);
                fields.push(k);
            });
            
            var name = component.get("v.name");
            console.warn('name: ', name);
            
            console.warn('id: ', id);
            console.warn("step: ", step);
            console.warn('fields: ', fields);
            console.warn('selection: ', selection);
            
            if (fields.length <= 0) {
                // Do nothing as the selection isn't interesting
            } else {
                
                var events = component.get("v.events");
                
                var event = {
                    name: name,
                    id: id,
                    step: step,                
                    fields: fields.join(),
                    selection: selection.join(),
                    timestamp: timestamp
                };
                
                //events.push(event);
                
                // Add to the head of the array, so latest will be at the top!
                events.unshift(event);
                
                component.set("v.events", events);
                component.set("v.eventsCleaned", false);
            }
        }
    },

    showDashboard: function(component) {
        var events = component.get("v.events");
        var id = events && events.length > 0 ? events[0].id : null;
        if (id) {
            component.set("v.dashboardId", id);
        }
    },
     
    storeSnapshot: function(component) {
        var events = component.get("v.events");
        
        console.warn('events: ', events, typeof events);

		/*        
        var evts = [];
        events.forEach(function(evt) {
            evts.push(evt)
        })
        */

        var evts = {};
        
        events.forEach(function(evt, i) {
            evts['' + Date.now() + i] = evt;
        })
        
        var params = {
            events: evts //JSON.parse(JSON.stringify(events))
        };
        
        console.warn('params: ', params);
        
        var action = component.get("c.addEvents");
        action.setParams(params);
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('addEvents returned: ', val);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);
        
    },
    
    createTable: function(component, events) {
        var header = component.find("table-head").getElement();
        var body = component.find("table-body").getElement();
        var tablefields = component.get("v.tablefields");
        console.warn('tablefields: ', tablefields);
        
        var fieldMap = {};
        tablefields.map(function(k) { fieldMap[k] = true; });
        console.warn('fieldMap: ', fieldMap);
        
        header.innerHTML = '';
        body.innerHTML = '';
        
        
        if (events.length > 0) {
            var row = document.createElement('tr');
            row.classList.add('slds-text-title_caps');
            var cell = null;
            var div = null;
            
            for (var key in events[0]) {
                if (fieldMap[key] === true) {
                    cell = document.createElement('th');
                    cell.setAttribute('scope', 'col');
                    div = document.createElement('div');
                    cell.classList.add('slds-truncate');
                    div.innerHTML = key;
                    cell.appendChild(div);
                    row.appendChild(cell);
                    
                }
            }
            header.appendChild(row);
            
            events.forEach(function(event) {
                row = document.createElement('tr');
                for (key in event) {
                    if (fieldMap[key] === true) {
                        cell = document.createElement('td');
                        cell.setAttribute('data-label', key);
                        div = document.createElement('div');
                        cell.classList.add('slds-truncate');
                        div.innerHTML = event[key];
                        div.setAttribute('title', event[key]);
                        cell.appendChild(div);
                        row.appendChild(cell);
                    }
                }
                
                body.appendChild(row);
            });
            
        }
        
    },
    
    getSelections: function(component) {
        
        console.warn('playerHelper.getSelections');
        
        // Get the events
        
        var params = {};
        
        var action = component.get("c.getSelections");
        console.warn('action: ', action);
        action.setParams(params);
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                var names = [];
                var ids = [];
                var steps = [];
                var fields = [];
                for (var name in val.names) { names.push(name); }
                for (var id in val.ids) { ids.push(id); }
                for (var step in val.steps) { steps.push(step); }
                var fieldMap = {};
                var fieldArr = null;
                for (var field in val.fields) {
                    fieldArr = field.split(',');
                    fieldArr.forEach(function(f) {
                        fieldMap[f] = true; 
                    });
                }
                for (var field in fieldMap) { fields.push(field); }
                component.set('v.names', names);
                component.set('v.ids', ids);
                component.set('v.steps', steps);
                component.set('v.fields', fields);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);		
    },
    
    getEvents: function(component) {
        
        var params = {};
        
        var selectedField = component.get("v.selectedField");
        if (typeof selectedField === "undefined" || selectedField === null || selectedField === "") {
            
        } else {
            var val = component.get("v." + selectedField);
            params[selectedField] = val;
        }
        
        console.warn('getEvents: ', params);
        
        // Get the events
        
        var action = component.get("c.getEvents");
        action.setParams(params);
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var val = response.getReturnValue();
                console.warn('val: ', val);
                component.set("v.events", val);
                /*
                self.createTable(component, val);
                */
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);        
    },
    
    getDashboardDetails: function(component, dashboardId, callback) {
        var self = this;
        
        var datasets = [];
        var datasetsMap = {};
        
        var datasetFieldsMap = {};
        
        self.describeDashboard(component, dashboardId, $A.getCallback(function(err, dashboard) {
            if (err !== null) {
                console.warn('describeDashboard error: ', err);
            } else {
                //console.warn('dashboard: ', dashboard);
                dashboard.datasets.forEach(function(dataset) {
                    
                    self.describeDataset(component, dataset.id, $A.getCallback(function(err, datasetDesc) {
                        if (err !== null) {
                            console.warn('describeDataset error: ', err);
                        } else {
                            //console.warn('dataset: ', datasetDesc);
                            datasets.push(datasetDesc);
                            datasetsMap[datasetDesc.id] = datasetDesc;
                            
                            self.getDatasetFields(component, datasetDesc.id, datasetDesc.currentVersionId, $A.getCallback(function(err, fields) {
                                if (err !== null) {
                                    console.warn('getDatasetFields error: ', err);
                                } else {
                                    //console.warn('fields: ', fields);
                                    datasetFieldsMap[datasetDesc.id] = fields;
                                    
                                    if (typeof callback === 'function') {
                                        callback(null, dashboard, datasets, datasetsMap, datasetFieldsMap);
                                    }
                                }
                            }));
                        }
                    }));
                });
            }            
        }));        
    },
    
    describeDashboard: function(component, dashboardId, callback) {
        console.warn("describeDashboard: ", dashboardId);
        var sdk = component.find("sdk");
        console.warn('sdk: ', sdk);
        
        var context = {apiVersion: "41"};
        var methodName = "describeDashboard";
        var methodParameters = {
            dashboardId: dashboardId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            console.warn('describeDashboard returned: ', err, data);
            if (err !== null) {
                console.error("describeDashboard error: ", err);
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
    
    describeDataset: function(component, datasetId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "41"};
        var methodName = "describeDataset";
        var methodParameters = {
            datasetId: datasetId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('describeDataset returned: ', err, data);
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
    
    getDatasetFields: function(component, datasetId, versionId, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "41"};
        var methodName = "getDatasetFields";
        var methodParameters = {
            datasetId: datasetId,
            versionId: versionId
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            //console.warn('getDatasetFields returned: ', err, data);
            if (err !== null) {
                console.error("getDatasetFields error: ", err);
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
    
    
    play: function(component, event) {
        console.warn('playerHelper.play');
        var events = component.get("v.events");
        console.warn("events: ", events);

        var self = this;
        
        events.forEach(function(event, i) {
    		self.fireEvent(component, i);
        });
        
    },

    deleteEvent: function(component, idx) {
        console.warn("deleteEvent: ", idx);
        var events = component.get("v.events");
        events.splice(idx, 1);
        component.set("v.events", events);
    },
    
    fireEvent: function(component, idx) {
        console.warn("fireEvent: ", idx);
        var events = component.get("v.events");
        var event = events[idx];
        console.warn("event: ", event);
        var self = this;

        var template = {datasets:{}};
        
        template.datasets[event.dataset_name] = [{
            fields: [event.fields],
            selection: event.selection.split(',')
        }];            
        
        var selectionJSON = JSON.stringify(template, null, 4);
        
        
        try {
            var obj = JSON.parse(selectionJSON);
            var selection = JSON.stringify(obj);
            
            var evt = $A.get('e.wave:update');
            var params = {
                value: selection,
                id: event.id,
                type: "dashboard"
            };
            console.warn('params: ', params);
            evt.setParams(params);
            evt.fire();
            
        } catch (e) {
            console.warn("JSON exception: ", e);
            //helper.showToast(component, "Error", "The selection JSON is invalid JSON, please check and try again.", "error", null);
            
        }            
    },
    
    clean: function(component, callback) {
        console.warn('clean called');
        var self = this;
        var events = component.get("v.events");
        var cleanEvents = [];
        var dirtyEvents = [];
        var dupEvents = [];
        var dashboards = {};
        var dupMap = {};
        var evt = null;
        var hash = null;
        var count = events.length;
        console.warn('count: ', count);
        events.forEach(function(event) {
            console.warn('event: ', event);
            self.describeDashboard(component, event.id, function(err, dashboard) {
                console.warn('describeDashboard returned: ', err, dashboard);
                console.warn('dashboard: ', dashboard);
                dashboards[dashboard.id] = dashboard;
                count--;
                console.warn('count now: ', count);
                if (count === 0) {
                    
                    console.warn('#####################################################################');
                    console.warn('dashboards: ', dashboards);
                    
                    var dashboard = null;
                    events.forEach(function(event) {
                        console.warn('event: ', event);
                        
                        evt = {
                            id: event.id,
                            name: event.name,
                            //dataset_name: event.dataset_name,
                            step: event.step,
                            fields: event.fields,
                            selection: event.selection
                        };
                        hash = JSON.stringify(evt);
                        console.warn("hash", hash);
                        console.warn("dupMap[" + hash + "] = ", dupMap[hash]);
                        if (dupMap[hash] === true) {
                            dupEvents.push(event);
                        } else {
                            dupMap[hash] = true;
                        }
                        
                        console.warn("dupMap: ", dupMap);
                        
                        dashboard = dashboards[event.id];
                        console.warn('dashboard: ', dashboard);
                        var step = dashboard.state.steps[event.step];
                        console.warn('step: ', step);
                        if (step.datasets && step.datasets.length > 0) {
                            var dataset = step.datasets[0];
                            console.warn('dataset: ', dataset);
                            console.warn('dataset id: ', dataset.id);
                            var datasetName = (dataset.namespace ? dataset.namespace + '__' : '') + dataset.name;
                            console.warn('----------------------------------------> datasetName: ', datasetName);
                            event.dataset_name = datasetName;
                            cleanEvents.push(event);
                        } else {
                            console.warn('----------------------------------------> step does not have a dataset, clean!!!');
                            dirtyEvents.push(event);
                        }
                    });
                    
                    if (dupEvents.length > 0) {
                        dupEvents.forEach(function(de, di) {
                            cleanEvents.forEach(function(ce, ci) {
                                if (ce.uid === de.uid) {
                                    cleanEvents.splice(ci, 1);
                                } 
                            });
                        });
                    }
                    
                    console.warn('cleanEvents: ', cleanEvents);
                    console.warn('dirtyEvents: ', dirtyEvents);
                    console.warn('dupEvents: ', dupEvents);
                    component.set("v.events", cleanEvents);
                    
                    component.set("v.eventsCleaned", true);

                    if (typeof callback === 'function') {
                        callback();
                    }
                }
                
            });
        });
        /*        
        events.forEach(function(event) {
            console.warn('event: ', event);
            self.getDashboardDetails(component, event.id, function(err, dashboard, datasets, datasetsMap, datasetFieldsMap) {
                console.warn('getDashboardDetails returned: ', err, dashboard, datasets, datasetsMap, datasetFieldsMap);
                console.warn('dashboard: ', dashboard);
                console.warn('datasets: ', datasets);
                console.warn('datasetsMap: ', datasetsMap);
                console.warn('datasetFieldsMap: ', datasetFieldsMap);
                
                var step = dashboard.state.steps[event.step];
                console.warn('step: ', step);
                if (step.datasets && step.datasets.length > 0) {
                    var dataset = step.datasets[0];
                    console.warn('dataset: ', dataset);
                    console.warn('dataset id: ', dataset.id);
                    var datasetName = (dataset.namespace ? dataset.namespace + '__' : '') + dataset.name;
                    console.warn('----------------------------------------> datasetName: ', datasetName);                    
                } else {
                    console.warn('----------------------------------------> step does not have a dataset, clean!!!');
                }
            });
            
        });
*/        
    }
    
})