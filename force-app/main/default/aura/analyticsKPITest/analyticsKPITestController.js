({
	init: function(component, event, helper) {
        
        var saql = "a = load \"0Fb1I000000GtoMSAS/0Fc1I0000024uXPSAY\"; a = filter a by 'IsWon' == \"true\"; a = filter a by date('CloseDate_Year', 'CloseDate_Month', 'CloseDate_Day') in [\"1 year ago\"..\"current day\"]; a = group a by 'IsWon'; a = foreach a generate max('Amount') as 'Max Amount', min('Amount') as 'Min Amount', sum('Amount') as 'Total Amount', avg('Amount') as 'Average Amount'; a = limit a 2000;";
        //var saql = "a = load \"0Fb1I000000GtoMSAS/0Fc1I000000JYBrSAO\";a = filter a by 'IsWon' == \"true\";a = filter a by date('CloseDate_Year', 'CloseDate_Month', 'CloseDate_Day') in [\"1 year ago\"..\"current day\"];a = group a by 'IsWon';a = foreach a generate max('Amount') as 'a_max', min('Amount') as 'a_min', sum('Amount') as 'a_amt', avg('Amount') as 'a_avg';a = limit a 2000;";
        component.set('v.saql', saql);

        helper.listLenses(component, function(err, lenses) {
            if (typeof lenses !== 'undefined' && lenses !== null) {
                component.set('v.lenses', lenses);
            } 
        });
        /*
        var lensDevName = 'df17eadx__KPI_Test';
        component.set('v.lensDevName', lensDevName);
        */
	}
})