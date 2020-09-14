({
    checkStartedState: function(cmp, event, helper){
        $A.log('airMonitorController: started value changed: ' + started);
        var started = cmp.get('v.started');
        var requestId = cmp.get('v.autoInstallRequestId');
        $A.log('airMonitorController: started value changed: ' + started);
        if (requestId && started){
            helper.checkStatus(cmp);
        }
        var interval = cmp.get('v.intervalTimerId');
        if (started && requestId && !interval){
            helper.startTimer(cmp);
        } else if (!started && interval){
            helper.stopTimer(cmp);
        }
    },
    cancelAutoInstallRequest: function(cmp, event, helper){
        if (cmp.get('v.autoInstallRequestId')){
            helper.cancelAutoInstallRequest(cmp);
        }
    },
    checkAttempts: function(cmp, event, helper){
        var attempt = cmp.get('v.attempt');
        var maxAttempts = cmp.get('v.maxAttempts');
        $A.log('airMonitorController: attempt has changed: ' + attempt 
               + ', max: ' + maxAttempts);
        if (attempt > maxAttempts){
            cmp.set('v.started', false);
        }
    },
    checkAutoInstallRequestState: function (cmp, event, helper){
        var autoInstallRequest = cmp.get('v.autoInstallRequest');
        var inProgressStatuses = cmp.get('v.inProgressStatuses');
        $A.log('airMonitorController: request state has changed: ' + autoInstallRequest.RequestStatus 
               + ', checking if is in progress: ' + inProgressStatuses);
        if (autoInstallRequest &&
            inProgressStatuses.indexOf(autoInstallRequest.RequestStatus)<0){
            $A.log('airMonitorController: request is no longer in progress');
            cmp.set('v.started', false);    
            var callback = $A.getCallback(cmp.get('v.callback'));
            if (callback){
	            $A.log('airMonitorController: callback is set. Calling...');
                callback(autoInstallRequest);
            }
        }
    }
})