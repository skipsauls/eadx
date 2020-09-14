({
    init: function(cmp, event, helper){
        var monitorApi = cmp.find('monitorApi');
        var waveAutoInstallRequest = cmp.get('v.waveAutoInstallRequest');
        cmp.set('v.internalWair', waveAutoInstallRequest);
        var progress = {requestInProgress: true,
                        visible: false,
                        nodes: [],
                        current: null,
                        hasError: false};
        if (waveAutoInstallRequest && 
            null != helper.actionableAssetEvents[waveAutoInstallRequest.requestType]){
            /*
             * Let's set up EMP subscription events for
             * WaveAssetEvent, but only if the wair is of
             * the right type. See helper.actionableAssetEvents.
             */
            var eventMap = helper.actionableAssetEvents[waveAutoInstallRequest.requestType];
            var eventArray = null != eventMap ? Object.keys(eventMap) : [];
            if (eventArray.length > 0){
                for (var key in eventArray){
                    progress.nodes.push({value: eventArray[key], 
                                        label: eventMap[eventArray[key]]});
                }
                monitorApi.setAssetCompleteHandler(eventArray, $A.getCallback(waveAssetEvent => {
                    helper.updateProgress(cmp, waveAssetEvent);
                }));
            }
        }
        cmp.set('v.progress', progress);
		monitorApi.start();        
    },

    cancelRequest: function(cmp, event, helper){
        helper.cancelRequest(cmp);
        helper.cleanupMonitorApi(cmp);
    },

    closeWizard: function(cmp, event, helper){
        cmp.set('v.busy', true);        
        cmp.set('v.waveAutoInstallRequest', cmp.get('v.internalWair'));
        helper.cleanupMonitorApi(cmp);
    },
    
	handleWairUpdate : function(cmp, event, helper) {
        var wairRequest = event.getParam('value');
        if (wairRequest == null){
            cmp.set('v.waveAutoInstallRequest', null);
            return;
        }
        var oldValue = event.getParam('oldValue');
        var completed = cmp.get('v.completedStatuses');
        var requestPermissions = cmp.get('v.requestPermissions');
        var changed = (oldValue == null || oldValue.requestStatus !== wairRequest.requestStatus) &&
        	completed.indexOf(wairRequest.requestStatus)<0;
        var progress = null != cmp.get('v.progress') ?
            cmp.get('v.progress') : {};
        var inProgress = helper.inProgress(wairRequest.requestStatus);
        if (changed){
            completed.push(wairRequest.requestStatus);
            cmp.set('v.completedStatuses', completed);
            var logEntry = helper.requestStatusMessages[wairRequest.requestType][wairRequest.requestStatus];
            helper.fireStatusUpdate(cmp, logEntry);
            progress.requestInProgress = inProgress;
            if (!inProgress){
                helper.cleanupMonitorApi(cmp);
            }
            cmp.set('v.progress', progress);
        }
	}
})