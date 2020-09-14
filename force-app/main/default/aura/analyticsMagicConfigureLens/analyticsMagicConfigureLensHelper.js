({
    setup: function(component) {
        var matchedLensIds = component.get('v.matchedLensIds') || '';
        //console.warn('matchedLensIds: ', matchedLensIds);
        var matchedLensIdMap = {};
        var ids = matchedLensIds.split(',');
        ids.forEach(function(id) {
            matchedLensIdMap[id] = true;
        });
        //console.warn('matchedLensIdMap: ', matchedLensIdMap);
        this.listLenses(component, function(err, lenses) {
            //console.warn('lenses: ', lenses);
            component.set('v.lenses', lenses);
           	var matchedLenses = [];
            lenses.forEach(function(lens) {
                //console.warn('lens.id: ', lens.id, matchedLensIdMap[lens.id]);
                if (matchedLensIdMap[lens.id] === true) {
                    matchedLenses.push(lens);
                }
            });
            //console.warn('matchedLenses: ', matchedLenses);
            component.set('v.matchedLenses', matchedLenses);
        });  
    },
    
    
    showKPI: function(component) {
        //console.warn('showKPI');
        var config = component.get('v.config');
        //console.warn('config: ', config);
        try {
            config = JSON.parse(config);
        } catch (e) {
            console.warn('JSON.parse error: ', e);
            config = undefined;
        }

        //console.warn('config: ', config);
        
        if (typeof config !== 'undefined' && config !== null && config !== '') {
        
            $A.createComponent(config.type, config.attributes, function(cmp, msg, err) {
                var kpi = component.find("kpi");
                if (err) {
                    console.warn("error: ", err);
                } else {
                    kpi.set("v.body", [cmp]);
                }            
            });
        }
    },
    
    listAssets: function(component, methodName, callback) {
        var sdk = component.find("sdk");
        
        var context = {apiVersion: "42"};
        var methodName = methodName;
        var methodParameters = {
            pageSize: 200
        };
        sdk.invokeMethod(context, methodName, methodParameters, $A.getCallback(function(err, data) {
            if (err !== null) {
                console.error("listAssets error: ", err);
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
    
    listLenses: function(component, callback) {
        this.listAssets(component, "listLenses", function(err, data) {
            //console.warn('listLenses returned: ', err, data);
            callback(err, data ? data.lenses : null); 
        });
    }
})