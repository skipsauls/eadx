({
	setup: function(component) {
        if (window.location.search !== null && typeof window.location.search !== 'undefined') {
            var search = window.location.search;
            var exp = new RegExp('[\\&\\?]', 'g');
            var keyvals = search.split(exp);
            var tokens = null;
            keyvals.forEach(function(keyval) {
                tokens = keyval.split('=');
                if (tokens.length > 1) {
                    if (tokens[0] === 'dashboardId') {
                        component.set('v.dashboardId', tokens[1]);
                    }
                }
            });
        }
	}

})