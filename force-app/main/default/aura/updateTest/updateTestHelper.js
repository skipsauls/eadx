({
    dashboardAFilter: {
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
    },
    
    dashboardBFilter: {
        datasets:{
            "eadx__starbucks_us_locations":[
                {
                    fields:[
                        "State"
                    ],
                    filter:{
                        operator:"in",
                        values:[
                            "CO"
                        ]
                    }
                }
            ]
        }
    },
    

})