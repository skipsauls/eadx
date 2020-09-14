({
	waitForAutoInstallRequest : function(cmp, autoInstallRequest) {
        var modalOverlay, monitorCmp;
        $A.createComponent('c:autoInstallRequestMonitor', {
            'autoInstallRequestId': autoInstallRequest.Id,
            'pollDelay': 5000,
            'callback': function(autoInstallRequest){
                if (autoInstallRequest){
	                $A.log('Request completed with status:' + autoInstallRequest.RequestStatus);                    
                }
                if (modalOverlay){
                    modalOverlay.close();
                }
            }
        }, function(monitor, status) {
               monitorCmp = monitor;
               if (status === "SUCCESS") {
                   cmp.find('overlayApi').showCustomModal({
                       body: monitor, 
                       showCloseButton: true,
                       closeCallback: function() {
	                       monitor.set('v.started', false);
                       }
                   }).then(function(overlay){
                       monitorCmp.set('v.started', true);
                       modalOverlay = overlay;
                   });
               }                               
           });

	}
})