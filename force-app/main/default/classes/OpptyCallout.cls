global class OpptyCallout {

    @future (callout=true)
    global static void testCallout(String id) {

        String query = 'q = load "0FbB000000017QxKAI\\/0FcB00000012MRPKA2";';
        query += 'q = filter q by \'Id\' == "' + id + '";';
        query += 'q = group q by (\'Type\', \'Name\', \'Id\');';
        query += 'q = foreach q generate \'Type\' as \'Type\', \'Name\' as \'Name\', \'Id\' as \'Id\', avg(\'Amount\') as \'avg_Amount\', avg(\'OpportunityAge\') as \'avg_OpportunityAge\';';
        query += 'q = order q by (\'Type\' asc, \'Name\' asc, \'Id\' asc);';
        query += 'q = limit q 2000;';
                   
        System.debug('query: ' + query);
        
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        String response = result.json;
        
        List <sObject> opptys = new List <sObject> ();
        
        // Deserialize the JSON to a map of key => value
        Map <String, Object> root = (Map <String, Object>) JSON.deserializeUntyped(response);
        
        // Get the results object from the root
        Map<String, Object> results = (Map <String, Object>) root.get('results');
        
        // Get the List of objects from results
        List <Object> records = (List <Object>) results.get('records');
        
        // Go through each of the objects
        for (Object obj : records) {
            // Cast the object to a map of key => value
            Map <String, Object> objMap = (Map <String, Object>) obj;
            System.debug('obj Id: ' + objMap.get('Id'));
            
            // Do something with the results from Wave...
            
        }
        


    }
}