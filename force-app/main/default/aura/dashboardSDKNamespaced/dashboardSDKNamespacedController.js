({
    handleAssetLoaded: function(component, event, helper) {
        console.warn('handleAssetLoaded - event: ', event);
        component.set('v.eventName', 'wave:assetLoaded');
        let params = event.getParams();
        let eventParamsJson = JSON.stringify(params, null, 2);
        component.set('v.eventParamsJson', eventParamsJson);
    },
    
    handleSelectionChanged: function(component, event, helper) {
        console.warn('handleSelectionChanged - event: ', event);
        component.set('v.eventName', 'wave:selectionChanged');
        let params = event.getParams();
        let eventParamsJson = JSON.stringify(params, null, 2);
        component.set('v.eventParamsJson', eventParamsJson);
    },

    handlePageChange: function(component, event, helper) {
        console.warn('handlePageChange - event: ', event);
        component.set('v.eventName', 'wave:pageChange');
        let params = event.getParams();
        let eventParamsJson = JSON.stringify(params, null, 2);
        component.set('v.eventParamsJson', eventParamsJson);
    },

    handleDiscover: function(component, event, helper) {
        console.warn('handleDiscover - event: ', event);
        component.set('v.eventName', 'wave:discover');
        let params = event.getParams();
        let eventParamsJson = JSON.stringify(params, null, 2);
        component.set('v.eventParamsJson', eventParamsJson);
    },

    handleDiscoverResponse: function(component, event, helper) {
        console.warn('handleDiscoverResponse - event: ', event);
        component.set('v.eventName', 'wave:discoverResponse');
        let params = event.getParams();
        let eventParamsJson = JSON.stringify(params, null, 2);
        component.set('v.eventParamsJson', eventParamsJson);
    },

    handleUpdate: function(component, event, helper) {
        console.warn('handleUpdate - event: ', event);
        component.set('v.eventName', 'wave:update');
        let params = event.getParams();
        let eventParamsJson = JSON.stringify(params, null, 2);
        component.set('v.eventParamsJson', eventParamsJson);
    },
    
    handleEadlWaveUpdate: function(component, event, helper) {
        console.warn('handleEadlWaveUpdate - event: ', event);
        component.set('v.eventName', 'c:eadlWaveUpdate');
        let params = event.getParams();
        let eventParamsJson = JSON.stringify(params, null, 2);
        component.set('v.eventParamsJson', eventParamsJson);
    },
    
    fireUpdateSelectionEvent: function(component, event,  helper) {
        console.warn('fireUpdateSelectionEvent');
        
    },

    fireUpdateFilterEvent: function(component, event,  helper) {
        console.warn('fireUpdateFilterEvent');
        
		let filter = {
            datasets:{
                "eadx__oppty_demo":[
                    {
                        fields:[
                            "StageName"
                        ],
                        filter:{
                            operator:"in",
                            values:[
                                "Value Proposition"
                            ]
                        }
                    }
                ]
            }
        };
        
		let json = JSON.stringify(filter, null, 2);
        
        let developerName = component.get('v.developerName');
        
        let params = {
            value: json,
            devName: developerName,
            type: "dashboard"
        };
        console.warn('params: ', params);
        
        let evt = $A.get('e.wave:update');
        evt.setParams(params);
        evt.fire();
        
    },
    
    fireEadlUpdateFilterEvent: function(component, event,  helper) {
        console.warn('fireEadlUpdateFilterEvent');
        
		let filter = {
            datasets:{
                "eadx__oppty_demo":[
                    {
                        fields:[
                            "StageName"
                        ],
                        filter:{
                            operator:"in",
                            values:[
                                "Value Proposition"
                            ]
                        }
                    }
                ]
            }
        };
        
		let json = JSON.stringify(filter, null, 2);
        
        let developerName = component.get('v.developerName');
        
        let params = {
            value: json,
            devName: developerName,
            type: "dashboard",
            
        };
        console.warn('params: ', params);

        let eadlAPI = component.find('eadl_api');
        console.warn('eadlAPI: ', eadlAPI);
        
        eadlAPI.createUpdateEvent(params.value, params.devName, null, params.type, function(err, evt) {
            console.warn('eadlAPI.createUpdateEvent returned: ', err, evt);
        });
/*
        
        let evt = $A.get('e.wave:update');
        evt.setParams(params);
        evt.fire();
*/
        
    },

    
    fireSelectionChangedEvent: function(component, event,  helper) {
        console.warn('fireSelectionChangedEvent');
        
    },
    
    firePageChangeEvent: function(component, event,  helper) {
        console.warn('firePageChangeEvent');
        
        let developerName = component.get('v.developerName');
        console.warn('developerName: ', developerName);
        let pageid = 'Private_Page';
        
        let evt = $A.get('e.wave:pageChange');
        
        let params = {
            devName: developerName,
            pageid: pageid
        };
        
        console.warn('params: ', params);
        
        evt.setParams(params);
                
        evt.fire();
    },
    
})