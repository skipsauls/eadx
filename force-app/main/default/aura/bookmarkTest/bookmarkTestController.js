({
    discover: function(component, event, helper) {
        var evt = $A.get('e.wave:discoverDashboard');
        evt.setParams({});
        evt.fire();
    },
    
    handleDiscoverResponse: function(component, event, helper) {
        var params = event.getParams();
        console.warn('handleDiscoverResponse: ', JSON.stringify(params, null, 2));
        
    },
    
    copyBookmark: function(component, event, helper) {
        //component.set("v.linkUrl", window.location.href);
        var input = document.querySelector('.link_url');
        input.value = window.location.href;
        // select doesn't appear to work on mobile!!!!
        //input.select();
        input.focus();
        input.setSelectionRange(0, 9999);
        document.execCommand("Copy");
    },
    
    handleSelectionChanged: function(component, event, helper) {
        var params = event.getParams();
        var id = params.id;
        
        //console.warn('id: ', id);
        component.set('v.dashboardId', id);
        var selectedDashboardId = component.get("v.selectedDashboardId");
        if (id !== null && typeof id !== 'undefined' && id !== '' && id !== selectedDashboardId) {            
            component.set('v.selectedDashboardId', id);
            var search = window.location.search;
            //console.warn('search: ', search);
            var search2 = '';
            if (search === null || typeof search === 'undefined' || search === '') {
                search2 = '?dashboardId=' + id;
            } else {
                var exp = new RegExp('[\\&\\?]', 'g');
                var keyvals = search.split(exp);
                //console.warn('keyvals: ', keyvals);
                var tokens = null;
                var delim = '?';
                var hasDashboardId = false;
                keyvals.forEach(function(keyval) {
                    //console.warn('keyval: ', keyval);
                    tokens = keyval.split('=');
                    //console.warn('tokens: ', tokens);
                    if (tokens.length > 1) {
                        search2 += delim + tokens[0] + '=';
                        if (tokens[0] === 'dashboardId') {
                            hasDashboardId = true;
                            search2 += id;
                        } else {
                            search2 += tokens[1];
                        }
                        delim = '&';
                    }
                });
                if (hasDashboardId === false) {
                    search2 += delim + 'dashboardId=' + id;                
                }
            }
            
            if (search2 !== window.location.search) {
                window.history.pushState(window.location.search, null, search2)
            }
        }
        
    },
    
    selectDashboard: function(component) {
        
        var self = this;
        var dashboardId = component.get("v.dashboardId");
        var developerName = component.get("v.developerName");
        console.warn("selectDashboard: ", dashboardId, developerName);
    }    
    
})