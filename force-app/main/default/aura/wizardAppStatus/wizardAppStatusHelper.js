({
    statusItems: [
        {
            label: "2 Dashboards created, 0 failed",
            iconName: "utility:check"
        },
        {
            label: "Application Complete!",
            iconName: "utility:check"
        }
        
    ],
    
    statusIndex: 0,
    
    updateStatus: function(component) {
        var self = this;
        setTimeout(function() {
            if (self.statusIndex < self.statusItems.length) {
                self.statusIndex++;
                var items = [];
                for (var x = 0; x < self.statusIndex; x++) {
                    items.push(self.statusItems[x]);
                }
				component.set('v.statusItems', items);	        
                self.updateStatus(component);
            }            
        }, 1000);
        
    },
    
	setup: function(component) {

        this.updateStatus(component);
	}
})