({
	startTimer : function(cmp) {
        var delay = cmp.get('v.pollDelay');
        var helper = this;
        var interval = window.setInterval($A.getCallback(function(){
            if (cmp.get('v.started')){
                $A.log('airMonitorHelper: timer triggered');
            	helper.checkStatus(cmp, helper);                
            }
        }), delay);
        cmp.set('v.intervalTimerId', interval);
	},
    stopTimer: function(cmp){
        var interval = cmp.get('v.intervalTimerId');
        if (interval){
            window.clearInterval(interval);
            cmp.set('v.intervalTimerId', null);
            $A.log('airMonitorHelper: timer cleared');
        }
    },
    checkStatus: function(cmp){
		var attempt = cmp.get('v.attempt');
		var requestId = cmp.get('v.autoInstallRequestId');
        var apiController = cmp.get('c.getAutoInstallRequest');
        $A.log('airMonitorHelper: checking request status');
        apiController.setParams({
            autoInstallRequestId: requestId
        });
        apiController.setCallback(cmp, function(response){
            var rv;
            if (response.getState() === 'SUCCESS') {
                rv = response.getReturnValue();
                cmp.set('v.autoInstallRequest', rv);
		        cmp.set('v.attempt', attempt+1);
		        $A.log('airMonitorHelper: attempt ' + attempt + ', status ' + rv.RequestStatus);
            } else {
                cmp.set('v.started', false);
            }
            
        });
        $A.enqueueAction(apiController);
    },
    cancelAutoInstallRequest: function(cmp){
		var attempt = cmp.get('v.attempt');
		var requestId = cmp.get('v.autoInstallRequestId');
        var apiController = cmp.get('c.cancelAutoInstallRequest');
        $A.log('airMonitorHelper: cancelling auto-install request');
        apiController.setParams({
            autoInstallRequestId: requestId
        });
        apiController.setCallback(cmp, function(response){
            var rv;
            if (response.getState() === 'SUCCESS') {
                rv = response.getReturnValue();
                cmp.set('v.autoInstallRequest', rv);
		        $A.log('airMonitorHelper: cancel request successful. status ' + rv.RequestStatus);
            } else {
		        $A.log('airMonitorHelper: cancel request unsuccessful.');
            }
            
        });
        $A.enqueueAction(apiController);
    }
})