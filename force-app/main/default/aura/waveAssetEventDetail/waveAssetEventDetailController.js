({
	init : function(cmp, event, helper) {
        cmp.set('v.columns',[
            { label: '', cellAttributes:{
                iconName:{ fieldName: 'statusIcon'},
                class: { fieldName: 'statusCssClass'}}, sortable: false, fixedWidth: 32},
            { label: 'Item Id', fieldName: 'itemId', type: 'text', fixedWidth: 165, sortable: false },
            { label: 'Label', fieldName: 'itemLabel', type: 'text', fixedWidth: 250, sortable: false} ,
            { label: 'Message', fieldName: 'message', type: 'text', fixedWidth: 800, wrapText: true, sortable: false}
        ]);
	}
})