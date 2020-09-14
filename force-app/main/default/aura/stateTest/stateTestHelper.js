({
    states: [
        {
            label: 'View1',
            id: '8wkB0000000ChDAIA0',
            value: {
                "datasets" : {
                    "eadx__opportunity" : [ {
                        "fields" : [ "StageName" ],
                        "filter" : {
                            "operator" : "in",
                            "values" : [ "Value Proposition" ]
                        },
                        "type" : "global"
                    } ]
                },
                "steps" : {
                    "StageName_1" : {
                        "metadata" : {
                            "groups" : [ "StageName" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Account_Type_Account_1" : {
                        "metadata" : {
                            "groups" : [ "Account.Industry" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Account_Industry_1" : {
                        "metadata" : {
                            "groups" : [ "Account.Industry" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Bork_1" : {
                        "metadata" : {
                            "groups" : [ "display" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Type_2" : {
                        "metadata" : {
                            "groups" : [ "Type" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "all_1" : {
                        "metadata" : {
                            "groups" : [ "StageName", "Type" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "CloseDate_1" : {
                        "metadata" : {
                            "groups" : [ "CloseDate" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    }
                }
            }
        },
        {
            label: 'Test Stage Prospecting',
            id: 'NA',
            value: {
                "datasets" : { },
                "steps" : {
                    "StageName_1" : {
                        "metadata" : {
                            "groups" : [ "StageName" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ "Prospecting" ]
                    },
                    "Account_Type_Account_1" : {
                        "metadata" : {
                            "groups" : [ "Account.Industry" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Account_Industry_1" : {
                        "metadata" : {
                            "groups" : [ "Account.Industry" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Bork_1" : {
                        "metadata" : {
                            "groups" : [ "display" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Type_2" : {
                        "metadata" : {
                            "groups" : [ "Type" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "all_1" : {
                        "metadata" : {
                            "groups" : [ "StageName", "Type" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "CloseDate_1" : {
                        "metadata" : {
                            "groups" : [ "CloseDate" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    }
                }
            }
        },
        {
            label: 'StageProspecting',
            id: '8wkB0000000ChDKIA0',
            value: {
                "datasets" : {
                    "eadx__opportunity" : [ {
                        "fields" : [ "StageName" ],
                        "filter" : {
                            "operator" : "in",
                            "values" : [ ]
                        },
                        "type" : "global"
                    } ]
                },
                "steps" : {
                    "StageName_1" : {
                        "metadata" : {
                            "groups" : [ "StageName" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ "Prospecting" ]
                    },
                    "Account_Type_Account_1" : {
                        "metadata" : {
                            "groups" : [ "Account.Industry" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Account_Industry_1" : {
                        "metadata" : {
                            "groups" : [ "Account.Industry" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Bork_1" : {
                        "metadata" : {
                            "groups" : [ "display" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "Type_2" : {
                        "metadata" : {
                            "groups" : [ "Type" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "all_1" : {
                        "metadata" : {
                            "groups" : [ "StageName", "Type" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    },
                    "CloseDate_1" : {
                        "metadata" : {
                            "groups" : [ "CloseDate" ],
                            "numbers" : [ ],
                            "strings" : [ ]
                        },
                        "values" : [ ]
                    }
                }
            }
        },
        {
            label: 'Simple Filter',
            id: 'NA',
            value:     {
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
    
    setup: function(component) {
        let self = this;
        self.refreshSavedViewsList(component);
    },
    
    refreshSavedViewsList: function(component, callback) {
        let self = this;
        self.listSavedViews(component, function(err, savedViews) {
            if (err) {
                console.warn('listSavedViews error: ', err);
                component.set('v.savedViews', null);
            } else {
                component.set('v.savedViews', savedViews);
            }
            if (callback !== null && typeof callback !== 'undefined') {
                callback(err, savedViews);
            }            
            
        });
        
    },
    
    listSavedViews: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        if (proxy.get('v.ready') !== true) {
            setTimeout(function() {
                console.warn('RETRY');
                self.listSavedViews(component, callback);
            }, 1000);
            return;
        }
        
        let dashboardId = component.get('v.dashboardId');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        let version = '46.0';
        let url = '/services/data/v' + version + '/wave/dashboards/' + dashboardId + '/savedviews?type=user';
        
        console.warn('url: ', url);
        
        let config = null;
        
        proxy.exec(url, 'GET', config, function(response) {
            console.warn('listSavedViews response: ', response);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.body.savedViews);
            } else {
                return null;
            }            
        });
    },
    
    getSavedView: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let dashboardId = component.get('v.dashboardId');        
        let savedViewId = component.get('v.savedViewId');
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        let version = '46.0';
        let url = '/services/data/v' + version + '/wave/dashboards/' + dashboardId + '/savedviews/' + savedViewId;
        
        console.warn('url: ', url);
        
        let config = null;
        
        proxy.exec(url, 'GET', config, function(response) {
            console.warn('getSavedView response: ', response);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.body);
            } else {
                return null;
            }            
        });
    },

    updateSavedView: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let dashboardId = component.get('v.dashboardId');        
        let savedViewId = component.get('v.savedViewId');
        let savedViewJson = component.get('v.savedViewJson');
        let savedView = JSON.parse(savedViewJson);
        console.warn('savedView: ', savedView);
        delete savedView.id;
        
        let body = JSON.stringify(savedView);
        console.warn('body: ', body);
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        let version = '46.0';
        let url = '/services/data/v' + version + '/wave/dashboards/' + dashboardId + '/savedviews/' + savedViewId;
        
        console.warn('url: ', url);
        
        proxy.exec(url, 'PATCH', body, function(response) {
            console.warn('updateSavedView response: ', response);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.body);
            } else {
                return null;
            }            
        });
    },

    createSavedView: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let dashboardId = component.get('v.dashboardId');        
        let savedViewId = component.get('v.savedViewId');
        let savedViewJson = component.get('v.savedViewJson');
        let savedView = JSON.parse(savedViewJson);
        console.warn('savedView: ', savedView);
        delete savedView.id;
        
        savedView.label = 'Testing 1234';
        
        let body = JSON.stringify(savedView);
        console.warn('body: ', body);
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        let version = '46.0';
        let url = '/services/data/v' + version + '/wave/dashboards/' + dashboardId + '/savedviews/' + savedViewId;
        
        console.warn('url: ', url);
        
        proxy.exec(url, 'POST', body, function(response) {
            console.warn('createSavedView response: ', response);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.body);
            } else {
                return null;
            }            
        });
    },

    deleteSavedView: function(component, callback) {
        let self = this;
        let proxy = component.find('proxy');
        
        let dashboardId = component.get('v.dashboardId');        
        let savedViewId = component.get('v.savedViewId');
        
        let body = null;
        
        // Construct/generate this!!!!!!!!!!!!!!!!
        let version = '46.0';
        let url = '/services/data/v' + version + '/wave/dashboards/' + dashboardId + '/savedviews/' + savedViewId;
        
        console.warn('url: ', url);
        
        proxy.exec(url, 'DELETE', body, function(response) {
            console.warn('deleteSavedView response: ', response);
            if (callback !== null && typeof callback !== 'undefined') {
                callback(null, response.body);
            } else {
                return null;
            }            
        });
    },
    
})