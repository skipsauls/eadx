({
    /*
q = load "eadx__cleaned_winemag_data_130k_v2";
q = foreach q generate 'c_id' as 'c_id', 'country' as 'country', 'description' as 'description',
'designation' as 'designation', 'id' as 'id', 'points' as 'points', 'price' as 'price', 'province' as 'province',
'region_1' as 'region_1', 'region_2' as 'region_2', 'taster_name' as 'taster_name', 
'taster_twitter_handle' as 'taster_twitter_handle', 'title' as 'title', 'variety' as 'variety',
'winequa.alcohol' as 'winequa.alcohol', 'winequa.chlorides' as 'winequa.chlorides',
'winequa.citric_acid' as'winequa.citric_acid', 'winequa.density' as 'winequa.density',
'winequa.fixed_acidity' as 'winequa.fixed_acidity', 'winequa.free_sulfur_dioxide' as 'winequa.free_sulfur_dioxide',
'winequa.id' as 'winequa.id', 'winequa.pH' as 'winequa.pH', 'winequa.quality' as 'winequa.quality',
'winequa.quality_2' as 'winequa.quality_2', 'winequa.residual_sugar' as 'winequa.residual_sugar',
'winequa.sulphates' as 'winequa.sulphates', 'winequa.total_sulfur_dioxide' as 'winequa.total_sulfur_dioxide',
'winequa.volatile_acidity' as 'winequa.volatile_acidity', 'winery' as 'winery';
q = limit q 100;
     */ 

    queryDefs: {
        'allFields': {
            datasetName: 'eadx__cleaned_winemag_data_130k_v2',
            filters: [
            ],
            fields: [
                {name: 'UPC', alias: 'UPC'},
                {name: 'country', alias: 'country'},
                {name: 'description', alias: 'description'},
                {name: 'designation', alias: 'designation'},
                {name: 'points', alias: 'points'},
                {name: 'price', alias: 'price'},
                {name: 'province', alias: 'province'},
                {name: 'region_1', alias: 'region_1'},
                {name: 'region_2', alias: 'region_2'},
                {name: 'taster_name', alias: 'taster_name'},
                {name: 'taster_twitter_handle', alias: 'taster_twitter_handle'},
                {name: 'title', alias: 'title'},
                {name: 'winequa.alcohol', alias: 'winequa.alcohol'},
                {name: 'winequa.chlorides', alias: 'winequa.chlorides'},
                {name: 'winequa.citric_acid', alias: 'winequa.citric_acid'},
                {name: 'winequa.density', alias: 'winequa.density'},
                {name: 'winequa.fixed_acidity', alias: 'winequa.fixed_acidity'},
                {name: 'winequa.free_sulfur_dioxide', alias: 'winequa.free_sulfur_dioxide'},
                {name: 'winequa.id', alias: 'winequa.id'},
                {name: 'winequa.pH', alias: 'winequa.pH'},
                {name: 'winequa.quality', alias: 'winequa.quality'},
                {name: 'winequa.quality_2', alias: 'winequa.quality_2'},
                {name: 'winequa.residual_sugar', alias: 'winequa.residual_sugar'},
                {name: 'winequa.sulphates', alias: 'winequa.sulphates'},
                {name: 'winequa.total_sulfur_dioxide', alias: 'winequa.total_sulfur_dioxide'},
                {name: 'winequa.volatile_acidity', alias: 'winequa.volatile_acidity'},
                {name: 'variety', alias: 'variety'},
                {name: 'winery', alias: 'winery'}
            ],
            orders: [
                ['UPC', 'asc'],
                ['winery', 'asc'],
                ['title', 'asc']
            ],
            limit: 100
        },
        'allFieldFilterOnWineryEqualsDecoy': {
            datasetName: 'eadx__cleaned_winemag_data_130k_v2',
            filters: [
                '\'winery\' == "Decoy"'
            ],
            fields: [
                 {name: 'UPC', alias: 'UPC'},
                {name: 'country', alias: 'country'},
                {name: 'description', alias: 'description'},
                {name: 'designation', alias: 'designation'},
                {name: 'points', alias: 'points'},
                {name: 'price', alias: 'price'},
                {name: 'province', alias: 'province'},
                {name: 'region_1', alias: 'region_1'},
                {name: 'region_2', alias: 'region_2'},
                {name: 'taster_name', alias: 'taster_name'},
                {name: 'taster_twitter_handle', alias: 'taster_twitter_handle'},
                {name: 'title', alias: 'title'},
                {name: 'winequa.alcohol', alias: 'winequa.alcohol'},
                {name: 'winequa.chlorides', alias: 'winequa.chlorides'},
                {name: 'winequa.citric_acid', alias: 'winequa.citric_acid'},
                {name: 'winequa.density', alias: 'winequa.density'},
                {name: 'winequa.fixed_acidity', alias: 'winequa.fixed_acidity'},
                {name: 'winequa.free_sulfur_dioxide', alias: 'winequa.free_sulfur_dioxide'},
                {name: 'winequa.id', alias: 'winequa.id'},
                {name: 'winequa.pH', alias: 'winequa.pH'},
                {name: 'winequa.quality', alias: 'winequa.quality'},
                {name: 'winequa.quality_2', alias: 'winequa.quality_2'},
                {name: 'winequa.residual_sugar', alias: 'winequa.residual_sugar'},
                {name: 'winequa.sulphates', alias: 'winequa.sulphates'},
                {name: 'winequa.total_sulfur_dioxide', alias: 'winequa.total_sulfur_dioxide'},
                {name: 'winequa.volatile_acidity', alias: 'winequa.volatile_acidity'},
                {name: 'variety', alias: 'variety'},
                {name: 'winery', alias: 'winery'}
            ],
            orders: [
                ['UPC', 'asc'],                
                ['winery', 'asc'],
                ['title', 'asc']
            ],
            limit: 100
        }
        
    },
    
	setup: function(component) {
		//this.refresh(component);
        
        try {
            webkit.messageHandlers.notify.postMessage(
                { 
                    msg: 'READY'
                });
        } catch(err) {
            console.error('notifyReady error: ', err);
        }
	},
    
    handleActive: function (component, event) {
        let self = this;
        let tab = event.getSource();
        let id = tab.get('v.id');
        console.warn('tab id: ', id);
        switch (id) {
            case 'wines' :
                //this.injectComponent('lightningcomponentdemo:exampleBadge', tab);
                //
                let fields = component.get('v.targetFields');
                console.warn('fields: ', fields);
                for (var key in fields) {
                    console.warn(key, ': ', fields[key]);
                }
        
                let record = component.get('v.targetRecord');
                console.warn('record: ', record);
                for (var key in record) {
                    console.warn(key, ': ', record[key]);
                }   
                
                break;
            case 'analytics' :
               	self.refresh(component);
                break;
        }
        
       
    },
    
    injectComponent: function (name, target) {
        $A.createComponent(name, {
            // no attrs
        }, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                target.set('v.body', contentComponent);
            } else {
                throw new Error(error);
            }
        });
    },
    
    refresh: function(component) {
        console.warn('refresh');
        return;
        
        let t1 = Date.now();
        let dashboardId = component.get('v.dashboardId');
        let height = component.get('v.height');
        
        let dataset = 'Qualification';
        let filter = '{"datasets": {"eadx__oppty_demo": [{"fields": ["StageName"],"filter": {"operator": "in","values": ["' + dataset + '"]}}]}}';
        
        let config = {
            dashboardId: dashboardId,
            height: height,
            openLinksInNewWindow: false,
            showHeader: false,
            showTitle: false,
            showSharing: false,
            filter: filter
        };
        console.warn('config: ', config);
        
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
        
    },
    
    handleRecordIdChanged: function(component) {
        console.warn('handleRecordIdChanged');
        return;
/*        
 * 
force:recordData
                                      recordId="{!v.recordId}"
                                      targetRecord="{!v.targetRecord}"
                                      targetFields="{!v.targetFields}" 
                                      fields="{!v.fields}"
*/                                      
		let recordId = component.get('v.recordId');
        let fields = component.get('v.fields');
        let targetRecord = component.get('v.targetRecord');
        let targetFields = component.get('v.targetFields');
        
        let config = {
            recordId: recordId,
            fields: fields
        };
        console.warn('config: ', config);
        
        $A.createComponent("force:recordData", config, function(cmp, msg, err) {
            console.warn('createComponent returned: ', cmp, msg, err);
            let recordData = component.find("recordData");
            console.warn('recordData: ', recordData);
            if (err) {
                console.warn("error: ", err);
            } else {
                recordData.set("v.body", [cmp]);
                console.warn('targetFields: ', cmp.get('v.targetFields'));
                component.set('v.targetRecord', cmp.get('v.targetRecord'));
                component.set('v.targetFields', cmp.get('v.targetFields'));
            }
        });        
    },
          
    getWineFromUPCCode: function(component) {
		let self = this;        
        let queryDef = self.queryDefs['allFields'];
        let upcCode = component.get('v.upcCode');
        queryDef.filters = [
            '\'UPC\' == "' + upcCode + '"'
        ];
        
        // q = filter q by 'UPC' == "739958149409";

        console.warn('queryDef.filters: ', queryDef.filters);
        self.buildQuery(component, queryDef, function(err, resp) {
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
                    
                    self.setFilter(component);
                    
                } catch (e) {
                    component.set('v.eaRecord', null);
                    component.set('v.imageUrl', null);
                }
            }
        });        
    },
    
    setFilter: function(component) {
        
/*
 * FILTER CONDITIONS
q = load "eadx__cleaned_winemag_data_130k_v2";
q = filter q by 'points' >= 88;
q = filter q by 'price' >= 23 && 'price' <= 27;
q = filter q by 'variety' == "Cabernet Sauvignon";
q = filter q by 'province' == "California";
q = filter q by 'winequa.quality' >= 5;
q = filter q by 'winequa.sulphates' >= 0.6 && 'winequa.sulphates' <= 0.7;
q = filter q by 'winequa.free_sulfur_dioxide' >= 13 && 'winequa.free_sulfur_dioxide' <= 17;
q = filter q by 'winequa.quality' is not null;
q = group q by 'title';
q = foreach q generate 'title' as 'title', avg('points') as 'avg_points', avg('price') as 'avg_price';
q = order q by 'avg_points' desc;
q = limit q 2000;
*/
        console.warn('################### setFilter');
        
        let dashboardId = component.get('v.dashboardId');
        let record = component.get('v.eaRecord');
		let filter = {
            datasets:{
                "eadx__cleaned_winemag_data_130k_v2":[
                    {
                        fields:[
                            "province"
                        ],
                        filter:{
                            operator:"matches",
                            values:[
                                record.province
                            ]
                        }
                    },
                    {
                        fields:[
                            "variety"
                        ],
                        filter:{
                            operator:"matches",
                            values:[
                                record.variety
                            ]
                        }
                    },
                    {
                        fields:[
                            "points"
                        ],
                        filter:{
                            operator:">=",
                            values:[[
                                record.points
                            ]]
                        }
                    },
                    {
                        fields:[
                            "price"
                        ],
                        filter:{
                            operator:">=",
                            values:[[
                                record.price
                            ]]
                        }
                    }
                ]
            }
        };
        console.warn('filter: ', JSON.stringify(filter, null, 2));
        var params = {
            value: JSON.stringify(filter),
            id: dashboardId,
            type: "dashboard"
        };
        console.warn('params: ', params);
        var evt = $A.get('e.wave:update');
        evt.setParams(params);
        evt.fire();        
    },
    
    old_getWineFromUPCCode: function (component) {
        let upcCode = component.get('v.upcCode');
        let action = component.get("c.lookupWineByUPCCode");
        action.setParams({
            code: upcCode
        });
        let self = this;       
        action.setCallback(this, function(response) {
            let state = response.getState();
            console.warn('state: ', state);
            if (state === "SUCCESS") {
                let val = response.getReturnValue();
                console.warn('val: ', val);
                component.set('v.targetFields', val);
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

  	buildQuery: function(component, queryDef, callback) {
        var action = component.get("c.buildQuery");
        var self = this;
        action.setParams({queryDef: JSON.stringify(queryDef)});
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
    }    
})