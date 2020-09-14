({
	init: function(component, event, helper) {
        /*
        let saql = "";
        saql += "q = load \"0FbB0000000BWZRKA4/0FcB0000002OPtKKAW\";";
		saql += "q = foreach q generate 'Id' as 'Id', 'Amount' as 'Amount', 'ForecastCategory' as 'ForecastCategory', 'LeadSource' as 'LeadSource', 'StageName' as 'StageName';";
		saql += "q = limit q 100;";
        */

        let dataset = {
            id: '0FbB0000000BWZRKA4',
            currentVersionId: '0FcB0000002OPtKKAW'
        };
        
        let saql = 'q = load "' + dataset.id + '/' + dataset.currentVersionId + '";'
        + 'q = foreach q generate \'ExpectedRevenue\' as \'ExpectedRevenue\', \'Fiscal\' as \'Fiscal\', \'FiscalQuarter\' as \'FiscalQuarter\', \'FiscalYear\' as \'FiscalYear\', \'ForecastCategory\' as \'ForecastCategory\', \'Id\' as \'Id\', \'IsWon\' as \'IsWon\', \'LeadSource\' as \'LeadSource\', \'Name\' as \'Name\', \'Probability\' as \'Probability\', \'StageName\' as \'StageName\', \'Type\' as \'Type\', \'eadx__OrderNumber__c\' as \'eadx__OrderNumber__c\';'
        + 'q = limit q 100;'        
        component.set('v.saql', saql);
	}
})