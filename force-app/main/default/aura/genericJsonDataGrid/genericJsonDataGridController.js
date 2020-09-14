({
	init: function(cmp, event, helper) {
        var items = cmp.get('v.items');
        var cols = cmp.get('v.cols');
        var columns = [];
        if (cols && cols.length > 0){
            var index, item;
            for (index in cols){
                item = cols[index];
                columns.push({
                    type: 'text',
                    fieldName: item,
                    label: item
                });                
            }
        } else{
            if (items && items.length > 0){
                var attr, item = items[0];
                for (attr in item){
                    columns.push({
                        type: 'text',
                        fieldName: attr,
                        label: attr
                    });
                }
            }            
        }
        cmp.set('v.columns', columns);
	},
    onRowSelection: function(cmp, event){
        var rows = event.getParam('selectedRows');
        var callback = cmp.get('v.onselect');
        if (callback){
            callback(rows[0]);
        }
    }
})