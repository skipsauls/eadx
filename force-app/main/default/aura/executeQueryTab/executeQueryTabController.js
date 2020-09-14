({
	test: function(component, event, helper) {

        helper.getDatasetByName(component, 'oppty_demo', function(err, dataset) {
            
            let query = 'q = load "' + dataset.id + '/' + dataset.currentVersionId + '";'
			+ 'q = foreach q generate \'CloseDate\' as \'CloseDate\', \'ExpectedRevenue\' as \'ExpectedRevenue\', \'Fiscal\' as \'Fiscal\', \'FiscalQuarter\' as \'FiscalQuarter\', \'FiscalYear\' as \'FiscalYear\', \'ForecastCategory\' as \'ForecastCategory\', \'Id\' as \'Id\', \'IsWon\' as \'IsWon\', \'LeadSource\' as \'LeadSource\', \'Name\' as \'Name\', \'Probability\' as \'Probability\', \'StageName\' as \'StageName\', \'Type\' as \'Type\', \'eadx__OrderNumber__c\' as \'eadx__OrderNumber__c\';'
			+ 'q = limit q 100;'
            
            //let query = 'q = load "' + dataset.id + '/' + dataset.currentVersionId + '";'
			//+ 'q = group q by (\'Type\', \'StageName\');'
			//+ 'q = foreach q generate \'Type\' as \'Type\', \'StageName\' as \'StageName\', max(\'Amount\') as \'max_Amount\';'
			//+ 'q = order q by (\'Type\' asc, \'StageName\' asc);'
			//+ 'q = limit q 2000;'
            
            console.warn('query: ', query);
            
            helper.executeQuery(component, query, function(err, results) {
                console.warn('executeQuery returned: ', err, results);
            });
        });
	}
})