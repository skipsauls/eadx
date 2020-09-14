global class EinsteinAnalyticsInvocableAction {
    
    global class EinsteinAnalyticsResult {
	    @InvocableVariable
    	global String Name;

	    @InvocableVariable
    	global Decimal max_Amount;        
    }

    @InvocableMethod(label='Get query results' description='Gets the results of an  Einstein Analytics query')
    public static List<EinsteinAnalyticsResult> getQueryResults() {
        
        Wave.ProjectionNode[] projs = new Wave.ProjectionNode[]{
            Wave.QueryBuilder.get('Name'),
            Wave.QueryBuilder.get('Amount').max().alias('max_Amount')
		};
		List<List<String>> orders = new List<List<String>>{new List<String>{'max_Amount', 'desc'}};
        ConnectApi.LiteralJson result = Wave.QueryBuilder.loadByDeveloperName('eadx__oppty_demo').foreach(projs).order(orders).cap(10).execute('q');    
        
        String response = result.json;
        
        Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(response);
        Map<String, Object> results = (Map<String, Object>) m.get('results');
        List<Object> records = (List<Object>) results.get('records');

        List<EinsteinAnalyticsResult> resultList = new List<EinsteinAnalyticsResult>();
		EinsteinAnalyticsResult resultItem;
/*        
        for (Object r: records) {
            Map<String, Object> record = (Map<String, Object>) r;
            resultItem = new EinsteinAnalyticsResult();
            resultItem.Name = (String) record.get('Name') ;
            resultItem.max_Amount = (Decimal) record.get('max_Amount');
            resultList.add(resultItem);
            
        }
*/        
        Map<String, Object> record = (Map<String, Object>) records.get(0);        
        resultItem = new EinsteinAnalyticsResult();
        resultItem.Name = (String) record.get('Name') ;
        resultItem.max_Amount = (Decimal) record.get('max_Amount');
        resultList.add(resultItem);

        return resultList;
    }
}