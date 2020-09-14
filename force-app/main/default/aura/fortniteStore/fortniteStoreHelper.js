({
    refreshStore: function (component) {
        var self = this;
        var fortnite = component.find('fortnite');
        var refresh = false;
        fortnite.getStore(refresh, function(err, store) {
            if (err) {
                console.warn('fortnite.getStore error: ', err);
            } else {
                var items = store.items;
                component.set('v.storeItems', items);
                var weeklyItems = [];
                var dailyItems = [];
                items.forEach(function(item) {
                    if (item.featured === 1) {
                        weeklyItems.push(item);
                    } else {
                        dailyItems.push(item);
                    }
                });
                component.set('v.weeklyItems', weeklyItems);
                component.set('v.dailyItems', dailyItems);
            }
        });
    }
})