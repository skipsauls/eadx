({
	fireCommanderState : function(cmp, state) {
        cmp.set('v.commanderState', state);
	},
    fireAnalyticsAppCreateEvent: function(cmp, event, autoInstallRequests){
        var event = cmp.getEvent("AnalyticsAppCreate");
        if (event && autoInstallRequests.length > 0){
            event.setParam('autoInstallRequest', autoInstallRequests[0].outputValues);
            event.fire();
        }
    },
    updateRecordingSession: function(cmp, event, recordingPayload){
        var recordingSessionData = recordingPayload[0].outputValues;
        if (null != recordingSessionData && !$A.util.isEmpty(recordingSessionData)){
            if (recordingSessionData.operation === "OP_START"){
	            cmp.set('v.recordingSession', recordingSessionData);                            
            } else {
	            cmp.set('v.recordingSession', null);                                            
            }
        }
    },
    toaster: function(message, type, duration){
        var toastEvent = $A.get("e.force:showToast");
        if (toastEvent){
            toastEvent.setParams({
                message: message,
                duration: duration ? duration : '5000',
                key: 'info_alt',
                type: type,
                mode: 'pester'
            });
            toastEvent.fire();            
        }
        else{
            $A.log('commanderUtilityController: ' + message);
        }        
    },
    handleMultipleResults: function(cmp, columns, results, keyAttribute, selectHandler){
        $A.log('commanderEventHandler: Multiple records returned, displaying in picker.');
        var modalBody, modalOverlay;
        $A.createComponent('c:genericJsonDataGrid', {
            'items': results, 
            'keyAttr': keyAttribute ? keyAttribute : 'id',
            'cols': columns,
            'onselect': function(selected){
                if (modalOverlay){
                    modalOverlay.close();
                }
                selectHandler(selected);
            }
        }, function(content, status) {
               if (status === "SUCCESS") {
                   modalBody = content;
                   cmp.find('overlayApi').showCustomModal({
                       header: "Results",
                       body: modalBody, 
                       showCloseButton: true,
                       closeCallback: function() {
                       }
                   }).then(function(overlay){
                       modalOverlay = overlay;
                   });
               }                               
           });
    },
    navigateTo: function(cmp, pageReference){
        var navService = cmp.find("navService");
        if (navService){
            navService.generateUrl(pageReference)
                .then($A.getCallback(function(url){
                    $A.log('commanderEventHandler: url:' + url);
                    navService.navigate(pageReference);
                }), $A.getCallback(function(error){
                    $A.log('commanderEventHandler: Record url error:' + error);
                }));
        } else {
            $A.log('commanderEventHandler: Unable to find navigation service.')
        }
    },
    viewSobject: function(cmp, sobject){
        var pageReference = {
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: sobject.id
            }
        };
        $A.log('commanderEventHandler: Navigating to sobject:' + sobject.name + ", id: " + sobject.id);
		this.navigateTo(cmp, pageReference);
        this.fireCommanderState(cmp, sobject.state);
    },
    viewDashboardWithState: function(cmp, state){
        var pageReference = {
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'eadx__Analytics_Dashboard'
            },
            state: state
        };
		this.navigateTo(cmp, pageReference);
    },
    channelSubscribe: function(cmp, channel){
        this.toaster('Connected to channel \'' + channel.topic + '\'.', 'success');
        cmp.set('v.commanderChannel', channel);
    },
    channelUnsubscribe: function(cmp){
        var commanderChannel = cmp.get('v.commanderChannel');
        if (null !== commanderChannel){
            this.toaster('Disconnected from current channel \'' + commanderChannel.topic + '\'.', 'success');            
        } else {
            this.toaster('Not currently connected.', 'error');            
        }
        cmp.set('v.commanderChannel', null);
    },
    viewDashboard: function(cmp, dashboard){
        $A.log('commanderEventHandler: Navigating to dashboard:' + dashboard.name + ", id: " + dashboard.id);
        this.viewDashboardWithState(cmp, {c__dashboardId: dashboard.id, c__forceRefresh: true});
        this.fireCommanderState(cmp, dashboard.state);
    },
    viewDashboardPage: function(cmp, page){
        $A.log('commanderEventHandler: Navigating to dashboard page:' + page.name + ", id: " + page.id);
        this.viewDashboardWithState(cmp, {c__dashboardId:page.id, c__pageId: page.name});
        this.fireCommanderState(cmp, page.state);
    },
    updateDashboardFilters: function(cmp, event){
        var commanderApi = cmp.find('commanderApi');
        var helper = this;
        var newState = event.getParam('state');
        var filters = event.getParam('filters');
        commanderApi.decodeState(newState, function(decodedState){
	        $A.log('commanderEventHandler: Updating dashboard filters...')
            helper.viewDashboardWithState(cmp, {
                c__dashboardId: decodedState.id,
                c__filters: $A.util.isEmpty(filters) ? null :
                	JSON.stringify({datasets : event.getParam('filters')})
            });
            helper.fireCommanderState(cmp, newState);
        });
    }
})