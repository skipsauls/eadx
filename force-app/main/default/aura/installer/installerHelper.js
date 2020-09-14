({
    
    /*        
        1 Datasets created, 0 failed
        1 Dashboards created, 0 failed
        1 Dataflows created, 0 failed        
        3 User Dataflow Instructions executed, 0 failed        
        1 User XMDs created, 0 failed        
        Application Complete!
        
	*/

    // Events for testing UI and logging
    sim: [
        {"CreatedDate":"2017-09-28T03:40:54Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"Dataset","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":"0FbB00000001I1hKAE","ItemName":"oppty_demo7","ItemLabel":"oppty_demo","Index":1,"Total":1,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:40:54Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"StoredQuery","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":null,"ItemName":null,"ItemLabel":null,"Index":0,"Total":0,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:40:54Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"Lens","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":null,"ItemName":null,"ItemLabel":null,"Index":0,"Total":0,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:40:55Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"Dashboard","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":"0FKB00000002rmZOAQ","ItemName":"Demo_Dashboard7","ItemLabel":"Demo Dashboard","Index":1,"Total":1,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:40:55Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"Dataflow","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":"02KB00000002qXXMAY","ItemName":"efasdf","ItemLabel":"efasdf","Index":1,"Total":1,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:40:56Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"AssetPruning","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":null,"ItemName":null,"ItemLabel":null,"Index":0,"Total":0,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:41:10Z","CreatedById":"005B0000003G9quIAC","WaveNamespace":"Dataflow","EventType":"ReplicationDataflowInstance","FolderId":"00lB0000000snNpIAI","ContainerId":"03CB0000000X8TqMAK","ItemId":"03LB0000005Ug2QMAS","ItemName":"Replication_Opportunity","ItemLabel":"Replication_Opportunity","Index":1,"Total":2,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:41:10Z","CreatedById":"005B0000003G9quIAC","WaveNamespace":"Dataflow","EventType":"ReplicationDataflowInstance","FolderId":"00lB0000000snNpIAI","ContainerId":"03CB0000000X8TqMAK","ItemId":"03LB0000005Ug2RMAS","ItemName":"register_Replication_Opportunity","ItemLabel":"register_Replication_Opportunity","Index":2,"Total":2,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:41:14Z","CreatedById":"005B0000003G9quIAC","WaveNamespace":"Dataflow","EventType":"UserDataflowInstance","FolderId":"00lB0000000v7rCIAQ","ContainerId":"03CB0000000X8TvMAK","ItemId":"03LB0000005Ug2aMAC","ItemName":"101","ItemLabel":"101","Index":1,"Total":3,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:41:14Z","CreatedById":"005B0000003G9quIAC","WaveNamespace":"Dataflow","EventType":"UserDataflowInstance","FolderId":"00lB0000000v7rCIAQ","ContainerId":"03CB0000000X8TvMAK","ItemId":"03LB0000005Ug2cMAC","ItemName":"optimize-102","ItemLabel":"optimize-102","Index":2,"Total":3,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:41:14Z","CreatedById":"005B0000003G9quIAC","WaveNamespace":"Dataflow","EventType":"UserDataflowInstance","FolderId":"00lB0000000v7rCIAQ","ContainerId":"03CB0000000X8TvMAK","ItemId":"03LB0000005Ug2bMAC","ItemName":"102","ItemLabel":"102","Index":3,"Total":3,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:41:16Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"UserXmd","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":"0FbB00000001I1hKAE","ItemName":"oppty_demo7","ItemLabel":"oppty_demo","Index":1,"Total":1,"Status":"Success","Message":null},
        {"CreatedDate":"2017-09-28T03:41:16Z","CreatedById":"005B0000003G9n2IAC","WaveNamespace":"Template","EventType":"Application","FolderId":"00lB0000000v7rCIAQ","ContainerId":null,"ItemId":"00lB0000000v7rCIAQ","ItemName":"efasdf","ItemLabel":"efasdf","Index":1,"Total":1,"Status":"Success","Message":null}
    ],
    
    eventTypeLabelMap: {
        "Dataset": { singular: "Dataset", plural: "Datasets", successAction: "created", failAction: "failed" },
        "Dashboard": { singular: "Dashboard", plural: "Dashboards", successAction: "created", failAction: "failed" },
        "Lens": { singular: "Lens", plural: "Lenses", successAction: "created", failAction: "failed" },
        "Dataflow": { singular: "Dataflow", plural: "Dataflows", successAction: "created", failAction: "failed" },
        "AssetPruning": { singular: "Asset", plural: "Assets", successAction: "pruned", failAction: "failed" },
        "ReplicationDataflowInstance": { singular: "Replication Dataflow Instruction", plural: "Replication Dataflow Instructions", successAction: "executed", failAction: "failed" },
        "UserDataflowInstance": { singular: "User Dataflow Instruction", plural: "User Dataflow Instructions", successAction: "executed", failAction: "failed" },
        "UserXmd": { singular: "User XMD", plural: "User XMDs", successAction: "created", failAction: "failed" },
        "Application": { successMessage: "Application Complete!", failMessage: "Application Failed." }
        
    },

    events: [],
    eventMap: {},
    eventStatus: {},
    
    fireSim: function(component, index) {
        var self = this;
        self.handleWaveAssetEvent(component, this.sim[index]);
        self.logWaveAssetEvent(component, this.sim[index]);
        if (index < this.sim.length - 1) {
            setTimeout(function() {
                self.fireSim(component, ++index);
            }, 300);
        }
    },
    
    simulate: function(component) {
        this.fireSim(component, 0);
    },

    getProgressItem: function(component, payload, callback) {
        var list = component.find("progress-list");
        var body = list.get("v.body");
        
        // Why isn't find working as expected?
		//var cmp = body.find(payload.EventType + "-item");
		
        // Workaround
		var cmp = null;
        body.forEach(function(c) {
            if (c.getLocalId() === payload.EventType + "-item") {
                cmp = c;
                //break;
            }
        });
        if (cmp) {
            callback(cmp);
        } else {
            $A.createComponent("c:installerProgressItem", {"aura:id": payload.EventType + "-item", size: "x-small"}, function(cmp, status, err) {
				if (status === "SUCCESS") {
                    body.push(cmp);
                    list.set("v.body", body);
                    callback(cmp);
                } else {
                    callback(null);
                }
            });
        }
    },
    
    showProgress: function(component, payload) {
        console.warn("showProgress: ", payload);
        var self = this;
        
        if (payload.Total > 0) {
            
            var list = component.find("progress-list").getElement();
            
            var status = self.eventStatus[payload.EventType] || {
                total: payload.Total,
                success: 0,
                fail: 0
            };
            
            if (payload.Status === "Success") {
                status.success += 1;
            } else {
                status.fail += 1;
            }
            self.eventStatus[payload.EventType] = status;

            var type = payload.EventType;
            var successAction = "created";
            var failAction = "failed";
            var content = null;
            var iconName = "clock";
            
            var eventTypeLabel = self.eventTypeLabelMap[payload.EventType];
            if (eventTypeLabel !== null && typeof eventTypeLabel !== "undefined") {
                if (eventTypeLabel.successMessage && payload.Status === "Success") {
    				content = eventTypeLabel.successMessage;
                } else if (eventTypeLabel.failMessage && payload.Status !== "Success") {                    
    				content = eventTypeLabel.failMessage;
                } else {
                    type = status.success > 1 ? eventTypeLabel.plural : eventTypeLabel.singular;
                    successAction = eventTypeLabel.successAction;
                    failAction = eventTypeLabel.failAction;                    
	            	content = status.success + " " + type + " " + successAction + ", " + status.fail + " " + failAction; 
                }
            } else {
            	content = status.success + " " + type + " " + successAction + ", " + status.fail + " " + failAction; 
            }
            var state = status.success === status.total ? "complete" : "incomplete";
            state = status.fail > 0 ? "failed" : state;
            console.warn("state: ", state);
            iconName = state === "complete" ? "success" : "clock";
            iconName = state === "failed" ? "ban" : iconName;
            console.warn("iconName: ", iconName);
            
			self.getProgressItem(component, payload, function(item) {
                if (item) {
                    item.set("v.content", content);
                    item.set("v.category", "utility");
                    item.set("v.name", iconName);
                    item.set("v.class", state);
                    
                } else {
                    console.warn("NO ITEM!!!!");
                }  
            });
            
            // Refresh the list when the app completes
            // THIS IS BRUTE FORCE FOR DEMO ONLY!!!!
            if (payload.EventType === "Application" && payload.Status === "Success") {
                self.refreshAppList(component);
                var progress = component.find("progress");
                $A.util.addClass(progress, "hide");
            }
        }
    },
    
    handleWaveAssetEvent: function(component, payload) {
        console.warn("helper.handleWaveAssetEvent: payload: ", payload);
        var self = this;
        self.events.push(payload);
        self.eventMap[payload.EventType] = payload;
        self.showProgress(component, payload);
    },
    
    logWaveAssetEvent: function(component, payload) {
        console.warn("helper.logWaveAssetEvent: payload: ", payload);
        var str = JSON.stringify(payload);
        var eventLog = component.get("v.eventLog");
        eventLog.push(str);
        component.set("v.eventLogStr", eventLog.join("\r\n"));        
    },

    listApps: function(component, callback) {
        console.warn("installerHeloper.listApps");
        var proxy = component.find('proxy');
        var self = this;
        var partialUrl = "/services/data/v41.0/wave/folders";
        
        proxy.doGet(partialUrl, function(response) {
            var apps = response.body.folders;
            if (typeof callback === "function") {
                callback(apps);
            }
        });
    },
    
    listAppTemplates: function(component, callback) {
        console.warn("installerHeloper.listAppTemplates");
        var proxy = component.find('proxy');
        var self = this;

        var partialUrl = "/services/data/v41.0/wave/templates?type=app";
        
        proxy.doGet(partialUrl, function(response) {
            var appTemplates = response.body.templates;
            if (typeof callback === "function") {
                callback(appTemplates);
            }
        });

    },
    
	createAppFromTemplate: function(component) {
        var proxy = component.find('proxy');
        var self = this;

        var partialUrl = "/services/data/v41.0/wave/folders";
        
        var label = component.get("v.appName");
        if (label === null || typeof label === "undefined") {
            label = "Test App " + new Date();
        }
        var regex = new RegExp("\ ", "g");
        var name = label.replace(regex, "_");

        var body = {                
            "description": "",
            "label": label,
            "assetIcon": "16.png",
            "templateSourceId": "0NkB00000004c0CKAQ",
            "templateValues": {
                "Overrides": {
                    "createAllDashboards": true,
                    "createAllLenses": true,
                    "createAllExternalFiles": true,
                    "createDataflow": true,
                    "createAllDatasetFiles": true,
                    "createAllImages": true
                },
                "Demo_Dashboard_state_widgets_chart_1_parameters_visualizationType": "stackvbar",
                "Demo_Dashboard_state_gridLayouts0_style_backgroundColor": "#FFFFFF"
            },
            "name": name
        };
        
        // Show the progress
        var progress = component.find("progress");
        $A.util.removeClass(progress, "hide");

        proxy.doPost(partialUrl, body, function(response) {
            console.warn("response: ", response);
            if (response.body && response.body.applicationStatus === "inprogressstatus") {
            }
        });
	},    

    headerActions: [
	    {label: "New Analytics App", name: "createApp", handler: null },
	    {label: "Test Create", name: "createAppFromTemplate", handler: null }
	],
    
    actionHandler: function(component, name) {
        console.warn("actionHandler: ", name);
        var self = this;
        if (self[name] && typeof self[name] === "function") {
            self[name](component);
        }
    },
    
    setup: function(component) {
        var self = this;
        
        var handler = function(name) {
            console.warn("handler: ", name);
            self.actionHandler(component, name);
        }
        
        self.headerActions.forEach(function(action) {
            action.handler = handler;
        });
        
        component.set("v.headerActions", self.headerActions);
        
        self.refreshAppList(component);        
    },
    
    apps: null,
    appTemplate: null,
    appMap: null,
    appTemplateMap: null,
    
    refreshAppList: function(component) {
        var self = this;        
        self.listAppTemplates(component, function(appTemplates) {
			self.appTemplates = [self.blankTemplate].concat(appTemplates);
            self.listApps(component, function(apps) {
                self.apps = apps;
                //console.warn("appTemplates: ", appTemplates);
                self.appTemplateMap = {};
                self.appTemplates.forEach(function(appTemplate) {
					self.appTemplateMap[appTemplate.id] = appTemplate;
                });
                //console.warn("apps: ", apps);
                self.appMap = {};
                self.apps.forEach(function(app) {
                    //console.warn("app: ", app);
                    if (app.templateSourceId) {
                        app.template = self.appTemplateMap[app.templateSourceId];
                    }
                    self.appMap[app.id] = app;
                });
                console.warn("self.appMap: ", self.appMap);
                
                var idx = 0;
                var app = null;
                var appItems = component.get("v.appItems");
                appItems = [];
                component.set("v.appItems", appItems);
                
                for (var appId in self.appMap) {
                    app = self.appMap[appId];
                    //console.warn("app: ", app);
                    
                    $A.createComponent("c:installerAppRow", {index: idx, app: app, handler: function(command, app) { self.handleAction(component, command, app) }}, function(cmp, status, err) {
                        if (status === "SUCCESS") {
                            appItems.push(cmp);
                        } else {
                            //
                        }
                    });
                    
                    idx++;
                }
                component.set("v.appItems", appItems);
            });            
        });
    },
    
    handleAction: function(component, command, app) {
        console.warn("handleAction: ", command, app);
        
        var self = this;
        if (command === "view") {
            self.viewApp(component, app);
        } else if (command === "delete") {
            self.deleteApp(component, app);
        } else if (command === "reconfigure") {
            self.reconfigureApp(component, app);
        }
	},
    
	viewApp: function(component, app) {
        console.warn("viewApp: ", app);    
		var win = window.open(app.assetSharingUrl, '_blank'); 	 	
    },
    
    reconfigureApp: function(component, app) {
        console.warn("reconfigureApp: ", app);        
    },
    
    deleteApp: function(component, app) {
        console.warn("deleteApp: ", app);
        
        var proxy = component.find('proxy');
        var self = this;
        
        var partialUrl = app.url;
        
        proxy.doDelete(partialUrl, function(response) {
            console.warn("delete response: ", response);
            self.refreshAppList(component);
	    });
    },
    
    createApp: function(component) {
        console.warn("installerHelper.createApp");
		this.openWizard(component, null);
    },
    
    blankTemplate: {
        "assetIcon":"16.png",
        "description":"Create and add content manually.",
        "icons":{
            "appBadge":{
                "name":"16.png",
                "url":"/analytics/wave/web/proto/images/app/icons/16.png"
            },
            "templateBadge":{
                "id":"081B0000000VaWhIAK",
                "name":"default_icon",
                "namespace":"blank",
                "url":"/analytics/wave/web/proto/images/template/icons/default.png"
            },
            "templateDetail":{
                "id":"081B0000000VaWmIAK",
                "name":"default_details",
                "namespace":"blank",
                "url":"/analytics/wave/web/proto/images/template/icons/default-details.png"
            }
        },
        "id":"BLANK_APP",
        "label":"Blank App",
        "name":"Blank_App",
        "namespace":"blank",
        "templateIcon":"default_icon",
        "templateType":"app"
    },
    
    openWizard: function(component, app) {
        console.warn("installerHelper.openWizard: ", app);
        var self = this;
        var dialogs = component.get("v.dialogs");
        var wizard = dialogs[0];
        console.warn("wizard: ", wizard);
        if (wizard) {
            wizard.show();
        } else {
            var config = {
                title: "New Einstein Analytics App",
                app: app,
                apps: self.apps,
                appTemplates: self.appTemplates,
                appMap: self.appMap,
                appTemplateMap: self.appTemplateMap,
                callback: function(context) {
                    self.handleWizardCallback(component, context);
                }
            };
            console.warn("config: ", config);
            $A.createComponent("c:installerWizard", config, function(cmp, status, err) {
                console.warn("installerHelper.openWizard - createComponent: ", cmp, status, err);
                if (status === "SUCCESS") {
                    var dialogs = component.get("v.dialogs");
                    dialogs.push(cmp);
                    component.set("v.dialogs", dialogs);
                } else {
                    //
                }
            });
        }

    },
    
    handleWizardCallback: function(component, context) {
        
    }
    
    /*
     URLs:
     
     List template:
     https://adx-dev-ed.my.salesforce.com/services/data/v41.0/wave/templates?type=app
     
     List apps created from template:
     https://adx-dev-ed.my.salesforce.com/services/data/v41.0/wave/folders?templateSourceId=0NkB00000004c0CKAQ
     
     Template configuration:
     https://adx-dev-ed.my.salesforce.com/services/data/v41.0/wave/templates/0NkB00000004c0CKAQ/configuration
     
     Post to create app:
     https://adx-dev-ed.my.salesforce.com/services/data/v41.0/wave/folders
     
     {
      "description": "",
      "label": "btwrhs",
      "assetIcon": "16.png",
      "templateSourceId": "0NkB00000004c0CKAQ",
      "templateValues": {
        "Overrides": {
          "createAllDashboards": true,
          "createAllLenses": true,
          "createAllExternalFiles": true,
          "createDataflow": true,
          "createAllDatasetFiles": true,
          "createAllImages": true
        },
        "Demo_Dashboard_state_widgets_chart_1_parameters_visualizationType": "stackvbar",
        "Demo_Dashboard_state_gridLayouts0_style_backgroundColor": "#FFFFFF"
      },
      "name": "btwrhs"
    }
    
    
	*/

     
})