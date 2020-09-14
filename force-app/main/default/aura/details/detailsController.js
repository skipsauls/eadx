({
    doInit: function(component, event, helper) {
    },
    
    handleRecordIdChange: function(component, event, helper) {
        //console.warn("detailsController.handleRecordIdChange");
        var recordId = component.get("v.recordId");
        //console.warn("recordId: ", recordId);
    },
    
    handleRecordChange: function(component, event, helper) {
        //console.warn("detailsControllerhandleRecordChange");
        var record = component.get("v.record");
        //console.warn("record: ", record);
    },
    
    
    handleRecordUpdated: function(component, event, helper) {
        //console.warn("detailsController.handleRecordUpdated");
        var record = component.get("v.record");
        //console.warn("record: ", record);
        //console.warn("record.id: ", record.id);
        var fields = component.get("v.fields");
        //console.warn("fields: ", fields);
        
        var recordId = component.get("v.recordId");
        //console.warn("recordId: ", recordId);
        
        var record = component.get("v.record");
        //console.warn("record: ", record);
        
        var recordFields = component.get("v.recordFields");
        //console.warn("recordFields: ", recordFields);        
    },
    
    handleSelectionChanged: function(component, event, helper) {
        //console.warn("######################################################### detailsController.handleSelectionChanged");
        var params = event.getParams();
        var id = params.id;
        var payload = params.payload;
        var noun = params.noun;
        var verb = params.verb;
        //console.warn("id: ", id);
        //console.warn("payload: ", payload, typeof payload);
        //console.warn("noun: ", noun);
        //console.warn("verb: ", verb);
        var fieldAttr = component.get("v.fields");
        var fields = fieldAttr.split(",");
        var fieldMap = {};
        fields.forEach(function(field) {
            field = field.trim();
            fieldMap[field] = 1;
        });
        //console.warn("fieldMap: ", fieldMap);
        if (payload) {
            var step = payload.step;
            var data = payload.data;
            //console.warn("step: ", step);
            //console.warn("data: ", data);
            var where = null;
            var test = false;
            data.forEach(function(obj) {
                for (var k in obj) {
                    //console.warn("key: ", k, ", value: ", obj[k]);
                    if (fieldMap[k] === 1) {
                        where = where || "WHERE (";
                        where += test ? " OR " : "";
                        where += k + " = '" + obj[k] + "'";
                        test = true;
                    }
                }
            });
            //console.warn("where: ", where);
            if (where !== null) {
                where += ")";
                component.set("v.where", where);
            } else {
                component.set("v.where", undefined);
            }
            helper.getRecords(component);   
        }
    }
    
})