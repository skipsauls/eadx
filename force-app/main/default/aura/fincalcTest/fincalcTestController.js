({
	test: function(component, event, helper) {
		var fincalc= component.find("fincalc");
        var type = component.get("v.type");
        console.warn("type: ", type);
        var values = component.get("v.values").split(",");
        console.warn("values: ", values);
        var total = fincalc.calculateTotal(type, values);
        console.warn("total: ", total);
	}
})