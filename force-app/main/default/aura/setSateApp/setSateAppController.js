({
    handleSetSate : function(component, event, helper) {
        var stateObj = {
    "pageId": "25076d68-e287-40b3-9943-20ffcc50f8fd",
    "state": {
        "datasets": {
            "eadx__oppty_demo": [
                {
                    "fields": [
                        "StageName"
                    ],
                    "type": "global",
                    "filter": {
                        "operator": "in",
                        "values": []
                    }
                }
            ]
        },
        "sObjects": {},
        "steps": {
            "LeadSource_1": {
                "values": [],
                "metadata": {
                    "groups": [
                        "LeadSource"
                    ]
                }
            },
            "IsWon_ForecastCatego_1": {
                "values": [],
                "metadata": {
                    "groups": [
                        "IsWon",
                        "ForecastCategory"
                    ]
                }
            },
            "StageName_1": {
                "values": [],
                "metadata": {
                    "groups": [
                        "StageName"
                    ]
                }
            },
            "Type_1": {
                "values": [],
                "metadata": {
                    "groups": [
                        "Type"
                    ]
                }
            },
            "Type_2": {
                "values": [],
                "metadata": {
                    "groups": [
                        "LeadSource"
                    ]
                }
            },
            "ForecastCategory_1": {
                "values": [],
                "metadata": {
                    "groups": [
                        "ForecastCategory"
                    ]
                }
            },
            "Type_StageName_Forec_1": {
                "values": [
                    [
                        "Existing Business",
                        "Needs Analysis"
                    ]
                ],
                "metadata": {
                    "groups": [
                        "Type",
                        "StageName"
                    ]
                }
            },
            "lens_1": {
                "values": [],
                "metadata": {
                    "groups": []
                }
            },
            "ForecastCategory_2": {
                "values": [],
                "metadata": {
                    "groups": [
                        "ForecastCategory"
                    ]
                }
            }
        }
    }
};
        var dashboard = component.find("dashboard_1");
        dashboard.setState(stateObj, function(res, err) {
            console.log('set state callback!');
            console.log(JSON.stringify(res, null, 4));
        });
    },
    
    handleGetSate : function(component, event, helper) {
        var dashboard = component.find("dashboard_1");
        if (dashboard && dashboard.isValid()) {
            var config = {};
            dashboard.getState(config, function(res, err) {
                console.log(JSON.stringify(res.payload, null, 4));
            });
        }
    }
})