({
	init: function(component, event, helper) {
		var items = [];
        var item = null;
        item = {
            imageUrl: 'https://df17eadx-dev-ed--c.na73.content.force.com/profilephoto/7291I000000XlK3/F',
            title: 'Test 1',
            header: 'Test 1',
            description: 'This is a test',
            altText: 'This is a test'
        };
        items.push(item);

        item = {
            imageUrl: 'https://df17eadx-dev-ed--c.na73.content.force.com/profilephoto/7291I000000XlK3/M',
            title: 'Test 2',
            header: 'Test 2',
            description: 'This is a test',
            altText: 'This is a test'
        };
        items.push(item);

        item = {
            imageUrl: 'https://df17eadx-dev-ed--c.na73.content.force.com/profilephoto/7291I000000XlK3/T',
            title: 'Test 3',
            header: 'Test 3',
            description: 'This is a test',
            altText: 'This is a test'
        };
        items.push(item);
        
        component.set('v.items', items);
	},
    
    handleItemsChange: function(component, event, helper) {
		var items = component.get('v.items');
        items.forEach(function(item) {
            console.warn('item: ', item, item.ariaSelected); 
        });
    }
})