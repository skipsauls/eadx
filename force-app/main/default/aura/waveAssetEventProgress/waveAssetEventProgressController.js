({
    init: function(cmp, event, helper){
        var nodes = cmp.get('v.nodes');
        var eventData = {};
        var eventArray = [];
        for (var index in nodes){
            eventData[nodes[index].value] = {};
            eventData[nodes[index].value].events = [];
            eventData[nodes[index].value].label = nodes[index].label;
            eventArray.push(nodes[index].value);
        }
        cmp.set('v.eventData', eventData);
        cmp.set('v.eventArray', eventArray);
    },
    
	updateProgress : function(cmp, event, helper) {
		helper.handleProgressUpdate(cmp, event, helper);
	},
    
    viewEventDetails: function(cmp, event, helper){
    	helper.viewEventDetails(cmp, event.getSource().get('v.value'));
	}
})