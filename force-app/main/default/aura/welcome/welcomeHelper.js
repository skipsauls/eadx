({
    items: [
        {
            name: 'twitter1',
            label: 'Twitter Live',
            developerName: 'eadx__Twitter_Live',
            resourceName: 'twitter1',
            imageName: null,
            imageUrl: null
        },        
        {
            name: 'dashstate1',
            label: 'Dashboard State',
            developerName: 'eadx__Dashboard_State',
            resourceName: 'dashstate1',
            imageName: null,
            imageUrl: null
        },
        {
            name: 'bolt1',
            label: 'SDK Demo',
            developerName: 'eadx__SDK_Demo',
            resourceName: 'bolt1',
            imageName: null,
            imageUrl: null
        },
        {
            name: 'explorer1',
            label: 'Analytics Explorer',
            developerName: 'eadx__Analytics_Explorer',
            resourceName: 'explorer1',
            imageName: null,
            imageUrl: null
        },
        {
            name: 'tableau_explorer1',
            label: 'Tableau Explorer',
            developerName: 'eadx__Tableau_Explorer',
            resourceName: 'tableau_explorer1',
            imageName: null,
            imageUrl: null
        },
        /* REMOVED UNTIL IT CAN BE FIXED
        {
            name: 'adx1',
            label: 'ADX Demo',
            developerName: 'eadx__ADX_Demo',
            resourceName: 'adx1',
            imageName: null,
            imageUrl: null
        },
        */
        {
            name: 'location1',
            label: 'Location Tree',
            developerName: 'eadx__Location_Tree',
            resourceName: 'location1',
            imageName: null,
            imageUrl: null
        },
        /* REMOVED UNTIL USERS/ROLES CAN BE SETUP
        {
            name: 'roletree1',
            label: 'Role Tree',
            developerName: 'eadx__Role_Tree',
            resourceName: 'roletree1',
            imageName: null,
            imageUrl: null
        },
        */
       {
            name: 'pagetest1',
            label: 'Page Navigation',
            developerName: 'eadx__Page_Test',
            resourceName: 'pagetest1',
            imageName: null,
            imageUrl: null
        },
        {
            name: 'imagemaptest1',
            label: 'Image Map Navigation',
            developerName: 'eadx__Image_Map_Test',
            resourceName: 'imagemaptest1',
            imageName: null,
            imageUrl: null
        },
        /*
        {
            name: 'lensqueries1',
            label: 'Lens Queries',
            developerName: 'eadx__Lens_Queries',
            resourceName: 'lensqueries1',
            imageName: null,
            imageUrl: null
        },
        */
        {
            name: 'pie1',
            label: 'Apex Step Demo',
            developerName: 'eadx__Apex_Step_Demo',
            resourceName: 'pie1',
            imageName: null,
            imageUrl: null
        },
        /*
        {
            name: 'templatemanager1',
            label: 'Template Manager',
            developerName: 'eadx__Template_Manager',
            resourceName: 'templatemanager1',
            imageName: null,
            imageUrl: null
        },
        */
        {
            name: 'fortnite1',
            label: 'Fortnite Analytics',
            developerName: 'eadx__Fortnite_Analytics',
            resourceName: 'fortnite1',
            imageName: null,
            imageUrl: null
        },        
        {
            name: 'letsrace1',
            label: 'Let\'s Race!',
            developerName: 'eadx__Lets_Race',
            resourceName: 'letsrace1',
            imageName: null,
            imageUrl: null
        },        
        {
            name: 'forcerecorddata1',
            label: 'Force Record Data',
            pageType: 'record',
            objectType: 'Opportuntity',
            developerName: '006B0000003LGrEIAW',
            resourceName: 'forcerecorddata1',
            imageName: null,
            imageUrl: null
        },
 

    ],
    
    navigateToPage: function(component, pageType, objectType, name) {
        //console.warn('navigateToPage: ', name);
        
        var navService = component.find("navService");
        
        var pageReference = null;
        
        if (pageType === 'record') {
            pageReference = {
                type: 'standard__recordPage',
                attributes: {
        			actionName: 'view',
                    objectApiName: objectType,
			        recordId: name
                },
                state: {
                }
            };        
        } else if (pageType === 'object') {
        
        } else {
            pageReference = {
                type: 'standard__navItemPage',
                attributes: {
                    apiName: name
                },
                state: {
                }
            };
        }
        
        navService.generateUrl(pageReference)
        .then($A.getCallback(function(url) {
            //console.warn('url: ', url);
            
            navService.navigate(pageReference);        
            
            
            if (typeof callback === 'function') {
                callback(null, {command: command, suggestedCommands: suggestedCommands});
            }                        
        }), $A.getCallback(function(error) {
            console.warn('error: ', error);
            
            if (typeof callback === 'function') {
                callback(error, {command: command});
            }
        }));
    }
})