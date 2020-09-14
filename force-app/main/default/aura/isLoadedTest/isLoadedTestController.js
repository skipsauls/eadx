({
	change: function(component, event, helper) {
		let dashboardIds = component.get('v.dashboardIds');
        let index = component.get('v.index');
        if (index++ >= dashboardIds.length) {
            index = 0;
        }
       	component.set('v.dashboardId', dashboardIds[index]);
        component.set('v.index', index);
	}
})