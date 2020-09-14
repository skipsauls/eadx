({
    inProgressStatuses: ['Enqueued', 'InProgress', 'AppInProgress'],
    
    completedStatuses: ['Success', 'Failed', 'Cancelled', 'Fail'],

    setStateEventHandler: function(cmp, event, cmpAttr){
        if (this.started(cmp)){
            throw 'IllegalState: You cannot set handlers after starting to monitor request.';
        }
        var args = event.getParam('arguments');
        cmp.set(cmpAttr, args.handler);
        if ('v.onAssetCompleteHandler' === cmpAttr){
            cmp.set('v.subscribedEventTypes', !args.eventTypes ? [] : args.eventTypes);
        }
    },

	startTimer : function(cmp) {
        var delay = cmp.get('v.pollerDelay');
        var helper = this;
        var interval = window.setInterval($A.getCallback(function(){
            if (helper.started(cmp)){
                $A.log('waveAutoInstallMonitor: timer triggered');
            	helper.checkStatus(cmp, helper);                
            }
        }), delay);
        cmp.set('v.pollerTimerId', interval);
	},
    
    startAppSubscription: function(cmp){
        var subscription = cmp.get('v.empSubscription');
        var waveAutoInstallRequest = cmp.get('v.waveAutoInstallRequest');
        var assetCallback = $A.getCallback(cmp.get('v.onAssetCompleteHandler'));
        var subscribedEventTypes = cmp.get('v.subscribedEventTypes');
        var helper = this;
        if (null == subscription){
            var empApi = cmp.find('empApi');
            empApi.onError($A.getCallback(error => {
                console.error('EMP API error: ', error);
                helper.stopAppSubscription(cmp);
                helper.startTimer(cmp);
            }));                    
            empApi.isEmpEnabled().then(function(enabled){
                if (!enabled){
                    // We can't do emp events, let's revert to 
                    // polling.
                    helper.startTimer(cmp);
                    return;
                }
                empApi.subscribe('/event/WaveAssetEvent', -2, $A.getCallback(event =>{
                    var payload = event.data.payload;
                    if (waveAutoInstallRequest.folderId === payload.FolderId){
                        // Let's check to see if it's a message that the caller is
                        // interested in.
                        if (assetCallback && subscribedEventTypes.indexOf(payload.EventType) > -1){
                            assetCallback(payload);
                        }
                    }
                    if (subscribedEventTypes.indexOf(payload.EventType) === (subscribedEventTypes.length-1) &&
                                helper.completedStatuses.indexOf(payload.Status) >= 0){
                        // Let's resume polling again
                        helper.startTimer(cmp);                    
                    }
                })).then(subscription => {
                    cmp.set('v.empSubscription', subscription);
                });                
            });
        }
    },

    stopAppSubscription: function(cmp){
        var subscription = cmp.get('v.empSubscription');
        if (null != subscription){
            var empApi = cmp.find('empApi');
            empApi.unsubscribe(subscription, $A.getCallback(response => {
                cmp.set('v.empSubscription', null);
            }));
        }
    },
    
    stopTimer: function(cmp){
        var timerId = cmp.get('v.pollerTimerId');
        if (timerId){
            window.clearInterval(timerId);
            cmp.set('v.pollerTimerId', null);
            $A.log('waveAutoInstallMonitor: timer cleared');
        }
    },
    
	started : function(cmp) {
		return cmp.get('v.started');
	},
    
    checkStatus: function(cmp, helper){
		var wairApi = cmp.find('wairApi');
        var waveAutoInstallRequest = cmp.get('v.waveAutoInstallRequest');
        var requestPermissions = cmp.get('v.requestPermissions');
        if (null !== waveAutoInstallRequest){
            wairApi.getInstallRequestById(waveAutoInstallRequest.id, 'Supplemental', function(response, error){
                if (error){
                    console.warn('waveAutoInstallMonitor ERROR: ' + error);
                    helper.stopTimer(cmp);
                    return;
                }
                cmp.set('v.waveAutoInstallRequest', response);
                if (null == response){
                    return;
                }
                if (helper.completedStatuses.indexOf(response.requestStatus) >= 0){
                    helper.stop(cmp);
                } else if (('AppInProgress' === response.requestStatus || 
                            ('InProgress' === response.requestStatus && 'StartDataflow' === response.requestType)) && 
                           requestPermissions.canSubscribeToEvents ){
                    // Now, the app is being built (or dataflow is running). Let's listen for platform
                    // events (WaveAssetEvent) for status.
                    helper.stopTimer(cmp);
                    helper.startAppSubscription(cmp);
                }
            });
        }
    },
    
    start : function(cmp){
    	this.startTimer(cmp);
        cmp.set('v.started', true);
	},

    stop : function(cmp){
    	this.stopTimer(cmp);
        this.stopAppSubscription(cmp);
        cmp.set('v.started', false);
        cmp.set('v.onAssetCompleteHandler', null)
	}
    
})