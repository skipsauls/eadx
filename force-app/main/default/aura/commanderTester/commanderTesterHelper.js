({
    commands: [
        {
            name: 'showDashboard',
            label: 'Show Dashboard 1',
            type: 'client',
            transcript: 'show dashboard leaderboard',
            config: {
                dashboardId: '0FKB00000003fBpOAI',
                height: '700',
                openLinksInNewWindow: true,
                showHeader: false,
                showTitle: false,
                showSharing: false                
            }
        },
        {
            name: 'filterBy',
            label: 'Filter Stage 1',
            type: 'client',
            transcript: 'filter stage by Value Proposition',
            config: {
                datasets:{
                    "eadx__opportunity":[
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
            }
        }
        
    ],
    
    config: {
        dashboardId: '0FKB00000003fBpOAI',
        height: '700',
        openLinksInNewWindow: true,
        showHeader: false,
        showTitle: false,
        showSharing: false        
    },
    
    config2: {
        dashboardId: '0FKB00000009TxnOAE',
        height: '700',
        openLinksInNewWindow: true,
        showHeader: false,
        showTitle: false,
        showSharing: false        
    },
    
    
    filter: {
        datasets:{
            "eadx__opportunity":[
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
    },
    
    restartFlow: function(component) {
        console.warn('commanderTesterHelper.restartFlow');
        var config = component.get('v.config');
        
        var flow = component.find('flowData');        
        
        var inputVariables = [
            {
                name: 'config',
                type: 'String',
                value: config
            }            
        ]
        if (typeof flow !== 'undefined' && flow !== null) {
            flow.startFlow('Analytics_Magic', inputVariables);        
        }
    } 
})