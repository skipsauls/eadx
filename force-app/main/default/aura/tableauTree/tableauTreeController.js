({
    init: function (component, event, helper) {
        //helper.refreshTree(component);
    },

	refresh: function (component, event, helper) {
        console.warn('refresh');
		var params = event.getParam('arguments');
        var callback = params.callback;
        helper.refreshTree(component, callback);
    },
    
	handleProxyReady: function (component, event, helper) {
        console.warn('handleProxyReady');
        setTimeout(function() {
	        //helper.refreshTree(component);
	        helper.setup(component);
        }, 300);
    },
    
    handleSelect: function (component, event, helper) {
        var name = event.getParam('name');
        helper.selectItem(component, name);
    },
    
    handleSiteNameChange: function(component, event, helper) {
        let siteName = component.get('v.siteName');
        let sites = component.get('v.sites');
        let site = null;
        sites.forEach(function(s) {
            if (s.contentUrl === siteName) {
                site = s;
            }
        });
        
        console.warn('site: ', site);
        
        if (site !== null && typeof site !== 'undefined') {
            component.set('v.site', site);
			helper.refreshTree(component);            
        }
    }, 
    
    handleSelectedItemChange: function(component, event, helper) {
        let selectedItem = component.get('v.selectedItem');
        console.warn('selectedItem: ', selectedItem);
        //helper.selectItem(component, selectedItem.name);
    } 
})