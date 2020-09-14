({
    refreshTree: function(component) {
        let self = this;
        
        let json = component.get('v.json');
        
        let obj = null;
        
        try {
            let obj = JSON.parse(json);
            if (typeof obj === 'undefined' || obj === null) {
                component.set('v.items', null);
                component.set('v.itemsMap', null);                
            } else if (typeof obj === 'array' || obj instanceof Array) {
                obj.forEach(function(item) {
                    self.addItem(component, item);
                });
            } else if (obj) {
                self.addItem(component, obj);            
            }
            
        } catch (e) {
            component.set('v.items', null);
            component.set('v.itemsMap', null);
            //console.error('Exception: ', e);
        }    
    },
    
    createTreeItem: function(component, key, label, value, item) {
        let self = this;    
        let itemsMap = component.get('v.itemsMap') || {};
        if (typeof value === "object") {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var treeItem = { 
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                expanded: false,
                disabled: false,
                items: []
            };
            itemsMap[treeItem.name] = {label: treeItem.label, value: item};
            
            var child = null;                
            if (value instanceof Array) {
                for (var i  = 0; i < value.length; i++) {
                    child = self.createTreeItem(component, key + "[" + i + "]", '' + i, value[i], item);
                    treeItem.items.push(child);
                    itemsMap[child.name] = {label: child.label, value: value[i]};
                }                    
            } else {
                for (var k in value) {
                    child = self.createTreeItem(component, key + "." + k, k, value[k], item);
                    treeItem.items.push(child);
                    itemsMap[child.name] = {label: child.label, value: value[k]};
                }                    
            }
            component.set('v.itemsMap', itemsMap);
            return treeItem;
        } else {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var treeItem = {
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                expanded: false,
                disabled: false,
                items: []
            };
            component.set('v.itemsMap', itemsMap);
            return treeItem;   
        }
    },
    
    addItem: function(component, item) {
        let self = this;
        
        let items = [];
        let itemsMap = component.get('v.itemsMap') || {};
        component.set('v.itemsMap', itemsMap);
        
        let name = 'root';
        if (item.name) {
            name = item.namespace ? item.namespace + '__' + item.name : item.name;
        }
        
        let label = item.label || 'root';
        
        let treeItem = { 
            label: label,
            name: name,
            expanded: true,
            disabled: false,
            items: []
        };                
        let treeItems = [];
        let value = null;
        let childItem = null;
        for (var key in item) {
            value = item[key];
            childItem = self.createTreeItem(component, name + '.' + key, key, value, item);
            treeItems.push(childItem);
            itemsMap[childItem.name] = {label: childItem.label, value: item};
        }
        treeItem.items = treeItems;
        itemsMap[treeItem.name] = {label: treeItem.label, value: item};
        
        items.push(treeItem);
        
        component.set('v.items', items);
        component.set('v.itemsMap', itemsMap);
    }
})