@RestResource(urlMapping='/fortnitelocations/*') 
global with sharing class ApexFortniteLocationsController {

    private static String fortniteLocationsQuery = '';
    static {
        fortniteLocationsQuery += 'q = load "0FbB0000000TNTQKA4/0FcB00000026FcfKAE";';
        //fortniteLocationsQuery += 'q = load "eadx__fortnite_locations";';
        //fortniteLocationsQuery += 'q = group q by (\'name\', \'id\');';
        //fortniteLocationsQuery += 'q = foreach q generate \'id\' as \'id\', \'name\' as \'name\', avg(\'latitude\') as \'avg_latitude\', avg(\'longitude\') as \'avg_longitude\', min(\'size\') as \'min_size\', avg(\'chests\') as \'avg_chests\', unique(\'id\') as \'unique_id\';';
        fortniteLocationsQuery += 'q = group q by \'name\';';
        fortniteLocationsQuery += 'q = foreach q generate \'name\' as \'name\', avg(\'chests\') as \'chests\';';
        //fortniteLocationsQuery += 'q = foreach q generate \'name\' as \'name\', avg(\'latitude\') as \'avg_latitude\', avg(\'longitude\') as \'avg_longitude\', min(\'size\') as \'min_size\', avg(\'chests\') as \'avg_chests\', unique(\'id\') as \'unique_id\';';
        fortniteLocationsQuery += 'q = order q by \'name\' asc;';
        fortniteLocationsQuery += 'q = limit q 2000;';
    }
   
   @HttpPost    
    global static String saqlQuery(String fields, String filter, String dummy) {

        //String query = fortniteLocationsQuery;
        
        System.debug('fields: ' + fields);
        System.debug('filter: ' + filter);
        System.debug('dummy: ' + dummy);
 
        String query = '';
        
        query += 'q = load "0FbB0000000TNTQKA4/0FcB00000026FcfKAE";';
        query += 'q = group q by \'id\';';
        query += 'q = foreach q generate ' + fields + ';'; // \'name\' as \'name\', avg(\'chests\') as \'chests\';';
        //fortniteLocationsQuery += 'q = foreach q generate \'name\' as \'name\', avg(\'latitude\') as \'avg_latitude\', avg(\'longitude\') as \'avg_longitude\', min(\'size\') as \'min_size\', avg(\'chests\') as \'avg_chests\', unique(\'id\') as \'unique_id\';';
        /*
        if (fields != null) {
    
            List<String> fieldList = fields.split(',');
            
            if (fieldList != null && fieldList.size() > 0) {
                String delim = '';
                for (String f : fieldList) {
                    query += delim + '\'' + f + '\' as \'' + f + '\'';
                    delim = ',';
                }
                query += ';';
            }
        } 
        */
        if (filter != null) {
            query += 'filter q by (' + filter + ')';
            /*
            List<String> filterList = filter.split(',');
            if (filterList != null && filterList.size() > 0) {
                query += 'filter q by (';
                String delim = '';
                for (String f : filterList) {
                    query += delim + '\'' + f + '\' as \'' + f.replace(' ', '_') + '\'';
                    delim = ',';
                }
                query += ');';
            }
            */
        }
        query += 'q = order q by \'id\' asc;';
        query += 'q = limit q 2000;';
        
        
        System.debug('query: ' + query);
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        //System.debug('result: ' + result);
        //System.debug('json: ' + result.json);
    
    
        //Map<String, Map<String, Object>> root = (Map<String, Map<String, Object>>) JSON.deserializeUntyped(result.json);
        Map<String, Object> root = (Map<String, Object>) JSON.deserializeUntyped(result.json);
        //System.debug('root: ' + root);
        
        Map<String, Object> results = (Map<String, Object>) root.get('results');
        List<Object> metadata = (List<Object>) results.get('metadata');
        List<Object> records = (List<Object>) results.get('records');
        

        //System.debug('results: ' + results);
        //System.debug('metadata: ' + metadata);
        //System.debug('records: ' + records);

        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();

        Map<String, Object> md = null;
        Map<String, Object> lineage = null;
        List<Object> projections = null;
        Map<String, Object> input = null;
        List<Object> columns = null;
        Map<String, Object> field = null;
        List<Object> groups = null;
        for (Object m: metadata) {
            md = (Map<String, Object>) m;
            //System.debug('md: ' + md);
            lineage  = (Map<String, Object>) md.get('lineage');
            //System.debug('lineage: ' + lineage);
            projections  = (List<Object>) lineage.get('projections');
            //System.debug('projections: ' + projections);
            Map<String, Object> column = null;            
            String type = null;
            String name = null;
            for (Object projection : projections) {
                //System.debug('projection: ' + projection);
                column = (Map<String, Object>) projection;
                //System.debug('column: ' + column);
                field = (Map<String, Object>) column.get('field');
                //System.debug('field: ' + field);
                name = (String) field.get('id');
                name = name.replace('q.', '');
                //System.debug('name: ' + name);
                type = (String) field.get('type');
                //System.debug('type: ' + type);
                if (type == 'numeric') {
                    numbers.add(name);
                } else {
                    strings.add(name);
                }                
            }

            // Add the players field, which is the number of players in a location
            numbers.add('players');
            
            Map<String, Object> record = null;
            for (Object r: records) {
                record = (Map<String, Object>) r;
                record.put('players', (Math.random() * 10).round());
            }
          
            
            input = (Map<String, Object>) lineage.get('input');
            groups = (List<Object>) input.get('groups');
            //System.debug('groups: ' + groups);

            Map<String, Object> grp = null;
            if (groups != null) {
                for (Object g: groups) {
                    grp = (Map<String, Object>) g;
                    //System.debug('group: ' + grp);
                    name = (String) grp.get('id');
                    name = name.replace('q.', '');
                    groupings.add(name);
                }
            }                
        }

        System.debug('strings: ' + strings);
        System.debug('numbers: ' + numbers);
        System.debug('groupings: ' + groupings);
                
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings); 
        
        return JSON.serialize(new PackagedReturnItem(records, rm));
        
        //return JSON.serialize(results);
    } 

    private class ReturnMetadata { 
    
        public final List<String> strings; 
        public final List<String> numbers; 
        public final List<Object> groupings; 
        
        public ReturnMetadata(List<String> strings, List<String> numbers, List<Object> groupings) { 
            this.strings = strings; 
            this.numbers = numbers; 
            this.groupings = groupings; 
        } 
    }
    
    private class PackagedReturnItem { 
    
        public final List<Object> data; 
        public final ReturnMetadata metadata; 
        
        public PackagedReturnItem(List<Object> data, ReturnMetadata metadata) { 
            this.data = data; 
            this.metadata = metadata; 
        } 
    }     
    
}