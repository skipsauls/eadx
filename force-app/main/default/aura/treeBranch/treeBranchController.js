({
	toggleExpanded: function(component, event, helper) {
        let source = event.getSource();
        let name = source.get('v.name');
		let items = component.get('v.items');
		let itemMap = component.get('v.itemMap');
        let item = itemMap[name];
        item.expanded = !item.expanded;
	},
    
    handleItemSelect: function(component, event, helper) {
        let target = event.target;
        let treeItem = target.closest('.slds-tree__item');
        let index = treeItem.dataset.itemIndex;
        let items = component.get('v.items');
        let item = items[index];
        
		let itemMap = component.get('v.itemMap');
        for (var name in itemMap) {
            itemMap[name].selected = false;
        }
        
		item.selected = true;
        component.set('v.items', items);

		component.set('v.selectedItem', item);        
    }
})