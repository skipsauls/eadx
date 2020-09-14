({
    refresh: function(component, event, helper) {
        /*
        let t1 = Date.now();
        let dashboardId = component.get('v.dashboardId');
        let height = component.get('v.height');
        
        let foo = 'Qualification';
        let filter = '{"datasets": {"eadx__oppty_demo": [{"fields": ["StageName"],"filter": {"operator": "in","values": ["' + foo + '"]}}]}}';
        
        let config = {
            dashboardId: dashboardId,
            height: height,
            openLinksInNewWindow: false,
            showHeader: false,
            showTitle: false,
            showSharing: false,
            filter: filter
        };
        
        $A.createComponent("wave:waveDashboard", config, function(cmp, msg, err) {
            let dashboard = component.find("dashboard");
            if (err) {
                console.warn("error: ", err);
            } else {
                dashboard.set("v.body", [cmp]);
            }
            let t2 = Date.now();
            console.warn('$A.createComponent timing: ' + (t2 - t1) + ' ms');
        });
        */
        
		helper.getWineFromUPCCode(component);

        let evt = component.getEvent('updateUPCCode');
        console.warn('evt: ', evt);
    },

    allWines: function(component, event, helper) {
        let queryDef = helper.queryDefs['allFields'];
        delete queryDef.filters;        
        helper.buildQuery(component, queryDef, function(err, resp) {
            console.warn('buildQuery returned: ', err, resp);
            if (err) {
                
            } else {
                let r = JSON.parse(resp);
                console.warn('resp: ', r);
                let query = r.query;
                console.warn('query: ', query);
                let records = r.results.records;
                console.warn('records: ', records);
            }
        });
    },

    decoyWines: function(component, event, helper) {
        let queryDef = helper.queryDefs['allFieldFilterOnWineryEqualsDecoy'];
        helper.buildQuery(component, queryDef, function(err, resp) {
            console.warn('buildQuery returned: ', err, resp);
            if (err) {
                
            } else {
                let r = JSON.parse(resp);
                console.warn('resp: ', r);
                let query = r.query;
                console.warn('query: ', query);
                let records = r.results.records;
                console.warn('records: ', records);
            }
        });
    },

    upcWine: function(component, event, helper) {
        let queryDef = helper.queryDefs['allFields'];
        let upcCode = component.get('v.upcCode');
        queryDef.filters = [
            '\'UPC\' == "' + upcCode + '"'
        ];
        
        // q = filter q by 'UPC' == "739958149409";

        console.warn('queryDef.filters: ', queryDef.filters);
        helper.buildQuery(component, queryDef, function(err, resp) {
            console.warn('buildQuery returned: ', err, resp);
            if (err) {
                
            } else {
                let r = JSON.parse(resp);
                console.warn('resp: ', r);
                let query = r.query;
                console.warn('query: ', query);
                let records = r.results.records;
                console.warn('records: ', records);
                let record = records[0];
                component.set('v.eaRecord', record);
            }
        });
    },

    handleSelectTabEvent: function(component, event, helper) {
        let tabId = event.getParam('id');
        component.set('v.selectedTabId', tabId);
    },

    handleUPCCodeEvent: function(component, event, helper) {
        let code = event.getParam('code');
        component.set('v.upcCode', code);
    },
    
    handleUPCCodeChanged: function(component, event, helper) {
        //helper.getWineFromUPCCode(component);

        let queryDef = helper.queryDefs['allFields'];
        let upcCode = component.get('v.upcCode');
        queryDef.filters = [
            '\'UPC\' == "' + upcCode + '"'
        ];
        
        // q = filter q by 'UPC' == "739958149409";

        console.warn('queryDef.filters: ', queryDef.filters);
        helper.buildQuery(component, queryDef, function(err, resp) {
            console.warn('buildQuery returned: ', err, resp);
            if (err) {
                
            } else {
                try {
                    let r = JSON.parse(resp);
                    console.warn('resp: ', r);
                    let query = r.query;
                    console.warn('query: ', query);
                    let records = r.results.records;
                    console.warn('records: ', records);
                    let record = records[0];
                    if (record.UPC) {
                        let resUrl = '$Resource.UPC_' + record.UPC;
                        console.warn('resUrl: ', resUrl);
                        let imageUrl = $A.get('$Resource.UPC_' + record.UPC);
                        component.set('v.imageUrl', imageUrl);
                    }
                    component.set('v.eaRecord', record);
                    helper.setFilter(component);
                } catch (e) {
                    component.set('v.eaRecord', null);
                    component.set('v.imageUrl', null);
                }
            }
        });        
    },

    handleRecordIdChanged: function(component, event, helper) {
        helper.handleRecordIdChanged(component);
    },
    
    handleRecordLoad: function(component, event, helper) {
        console.warn('handleRecordLoad: ', event);
    },

    handleActiveTab: function(component, event, helper) {
        helper.handleActive(component, event);
    },

    old_test: function(component, event, helper) {
        console.warn('calling webkit.messageHandlers.geocodeAddress.postMessage');
        try {
            webkit.messageHandlers.geocodeAddress.postMessage({ 
                street: '11 Allensby Lane',
                city: 'San Rafael',
                state: 'CA',
                country: 'USA'
            });
        } catch (e) {
            
        }        
        
        let foo = 'Qualification';
        let filter = '{"datasets": {"eadx__opportunity": [{"fields": ["StageName"],"filter": {"operator": "in","values": ["' + foo + '"]}}]}}';
        console.warn('filter: ', filter);
        console.warn('filter: ', JSON.stringify(filter, null, 2));
        let params = {id: "0FKB0000000E1iROAS", type: "dashboard", value: filter};
        console.warn('params: ', params);
        console.warn('params: ', JSON.stringify(params, null, 2));
        
        let evt = $A.get("e.wave:update");
        evt.setParams(params);
        evt.fire();
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        console.warn('params: ', JSON.stringify(params));
        var id = params.id;
        component.set("v.dashboardId", id);
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
                }
            });
        }
        
        try {
            
            if (webkit && webkit.messageHandlers && webkit.messageHandlers.handleWaveSelectionChanged) {
                console.warn('calling webkit.messageHandlers.handleWaveSelectionChanged.postMessage');
                webkit.messageHandlers.handleWaveSelectionChanged.postMessage({ 
                    id: params.id,
                    payload: payload
                });
            }
        } catch (e) {
            
        }
    }
    
})