({
    init : function(cmp, event, helper) {
    	const request = cmp.get('v.waveAutoInstallRequest');
    	if (request && request.requestLog) {
    		const array = request.requestLog.split('*');
            if (array.length > 1){
                array.shift();                
            }
    		cmp.set('v.messages', array);
    	}
    }
})