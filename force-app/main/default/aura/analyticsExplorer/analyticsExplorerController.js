({
	init: function (component, event, helper) {
        helper.handleRefresh(component);
    },
    
    handleSelect: function(component, event, helper) {
        console.warn('analyticsExplorerController.handleSelect: ', event);
    },
    
    handleRefresh: function(component, event, helper) {
        helper.handleRefresh(component);
    },
    
    handleView: function(component, event, helper) {        
        //console.warn('analyticsExplorerController.handleView: ', event);
        var asset = component.get('v.asset');
        console.warn('asset: ', asset);
        if (asset !== null && typeof asset !== 'undefined') {
            console.warn('editing: ', asset);
            
            var url = '/analytics/wave/wave.apexp/#' + asset.type + '/' + asset.id;
            var win = window.open(url, '_blank');
            win.focus();            
        }
    },
    
    handleEdit: function(component, event, helper) {        
        //console.warn('analyticsExplorerController.handleEdit: ', event);
        var asset = component.get('v.asset');
        console.warn('asset: ', asset);
        if (asset !== null && typeof asset !== 'undefined') {
            console.warn('editing: ', asset);
            
            var url = '/analytics/wave/wave.apexp/#' + asset.type + '/' + asset.id + '/edit';
            var win = window.open(url, '_blank');
            win.focus();            
        }
    },
    
    onWaveSelectionChanged: function(component, event, helper) {        
        //console.warn('################################ onWaveSelectionChanged: ', event);
        var params = event.getParams();
        var value = null;
        var json = null;
        for (var key in params) {
            value = params[key];
            //console.warn(key, ' = ', value, typeof value);
            if (typeof value === 'object') {
                json = JSON.stringify(value, null, 2)
                //console.warn('json: ', json);
                value = JSON.parse(json);
                //console.warn('value: ', value);
            }
            //console.warn(key + ' = ' + value);
        }
    }    
    
})