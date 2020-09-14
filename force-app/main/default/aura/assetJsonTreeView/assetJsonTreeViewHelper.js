({
	refreshTree: function(component) {
        let self = this;
        
		let json = component.get('v.json');
        let asset = component.get('v.asset');
        let assetDetails = component.get('v.assetDetails');
        
        console.warn('assetDetails: ', assetDetails, typeof assetDetails);
        if (typeof assetDetails === 'undefined' || assetDetails === null) {
            component.set('v.items', null);
        	component.set('v.itemsMap', null);
        } else if (typeof assetDetails === 'array' || assetDetails instanceof Array) {
            assetDetails.forEach(function(assetDetail) {
		        self.addAssetItem(component, assetDetail.label, assetDetail);
            });
        } else if (asset) {
	       self.addAssetItem(component, asset.label, assetDetails);            
        }
	},
    
    createAssetDetailItem: function(component, key, label, value, resType, asset) {
        var self = this;    
        if (typeof value === "object") {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = { 
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                expanded: false,
                disabled: false,
                items: []
            };
            
            var child = null;                
            if (value instanceof Array) {
                for (var i  = 0; i < value.length; i++) {
                    child = self.createAssetDetailItem(component, key + "[" + i + "]", '' + i, value[i], resType, asset);
                    item.items.push(child);
                }                    
            } else {
                for (var k in value) {
                    child = self.createAssetDetailItem(component, key + "." + k, k, value[k], resType, asset);
                    item.items.push(child);
                }                    
            }
            return item;
        } else {
            //var label = key + (typeof value !== 'object' ? ': ' + value : '');
            var item = {
                label: label + (typeof value !== 'object' ? ': ' + value : ''),
                name: key,
                expanded: false,
                disabled: false,
                items: []
            };
            return item;   
        }
    },
    
    addAssetItem: function(component, nodeLabel, asset) {
        let self = this;
        
        let items = [];
        let itemsMap = {};
        
		let name = asset.namespace ? asset.namespace + '__' + asset.name : asset.name;
        
        let label = asset.label || asset.name;
            
        let assetItem = { 
            label: label,
            name: name,
            expanded: true,
            disabled: false,
            items: []
        };                
        let assetItems = [];
        let value = null;
        let item = null;
        for (var key in asset) {
            value = asset[key];
            item = self.createAssetDetailItem(component, name + '.' + key, key, value, nodeLabel, asset);
            assetItems.push(item);
	        itemsMap[item.name] = item;
        }
        assetItem.items = assetItems;
        itemsMap[assetItem.name] = assetItem;
        
        items.push(assetItem);
        
        component.set('v.items', items);
        component.set('v.itemsMap', itemsMap);
    }
})