@RestResource(urlMapping='/soqlquery/*') 
global with sharing class SOQLQueryController {
               
    @HttpPost            
    global static String query(String query, List<String> strings, List<String> numbers, List<String> groupings, String abswitch) {

        List<Object> records = new List<Object>();

        try {
            records = Database.query(query);
        } catch (System.QueryException qe) {
        }
                
        Map<String, Object> response = new Map<String, Object>();
        Map<String, Object> metadata = new Map<String, Object>();
        metadata.put('strings', strings);
        metadata.put('numbers', numbers);
        metadata.put('groupings', groupings);
                
        response.put('data', records);
        response.put('metadata', metadata);
        
        return JSON.serialize(response);
    } 
}