({
	doCalcTotals: function(component, event, helper) {
		var params = event.getParam('arguments');
        var type = params.type;
        var values = params.values;
        var total = 0;
        values.forEach(function(val) {
            if (type === "sum") {
	            total += parseFloat(val);
            }
        });
		return total;
	}
})