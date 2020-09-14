global with sharing class AnalyticsEventController {

    @AuraEnabled
    global static String addSelection(String name, String id, String step, String dataset_name, String fields, String selection) {
    
        System.debug('addSelection - id: ' + id + ', step: ' + step + ', dataset_name: ' + dataset_name + ', fields: ' + fields + ', selection: ' + selection);

        AnalyticsEvent__c event = new AnalyticsEvent__c(name=name, id__c=id, step__c=step, dataset_name__c=dataset_name, fields__c=fields, selection__c=selection);
        
        upsert event;
        
        String ret = 'success';
        
        return ret;
    }

    @AuraEnabled
    global static String addEvents(Map<String, Object> events) {
    
        System.debug('addEvents: ' + events);
        AnalyticsEvent__c event = null;
        
        Map<Object, Object> evt = null;

        String groupName = null;
        
        for (String key : events.keySet()) {
            System.debug('key: ' + key);
            evt = (Map<Object, Object>) events.get(key);
            System.debug('event: ' + evt);
            groupName = (String) evt.get('name');
        }
        
        System.debug('groupName: ' + groupName);
        
        // Brute force?
        List<AnalyticsEvent__c> evts = [SELECT Id,name FROM AnalyticsEvent__c WHERE name=:groupName];
        DELETE evts;
                        
        for (String key : events.keySet()) {
            System.debug('key: ' + key);
            evt = (Map<Object, Object>) events.get(key);
            System.debug('event: ' + evt);

            String name = (String) evt.get('name');
            String uid = (String) evt.get('uid');
            String id = (String) evt.get('id');
            String dataset_name = (String) evt.get('dataset_name');
            String step = (String) evt.get('step');
            String fields = (String) evt.get('fields');
            String selection = (String) evt.get('selection');

            event = new AnalyticsEvent__c(name=name, id__c=id, step__c=step, dataset_name__c=dataset_name, fields__c=fields, selection__c=selection);
            
            upsert event;
            
        }
        
        String ret = 'success';
        
        return ret;
    }


    @AuraEnabled
    global static List<Map<String, Object>> getEvents(String name, String id, String step, String field) {
    
        System.debug('getEvents - id: ' + id + ', step: ' + step + ', field: ' + field);
        
        String query = 'SELECT id,name,id__c,step__c,dataset_name__c,fields__c,selection__c,type__c,LastModifiedDate,LastModifiedBy.Id,LastModifiedBy.Username FROM AnalyticsEvent__c';
        
        String delim = ' WHERE ';
        if (name != null) {
            query += delim + ' name = \'' + name + '\'';
            delim = ' AND ';
        }
        if (id != null) {
            query += delim + ' id__c = \'' + id + '\'';
            delim = ' AND ';
        }
        
        // Can't filter large textareas!!!!
        /*
        if (step != null) {
            query += delim + ' step__c = \'' + step + '\'';
            delim = ' AND ';
        }
        if (field != null) {
            query += delim + ' fields__c LIKE \'' + field + '\'';
            delim = ' AND ';
        }
        */
        
        query += ' ORDER BY LastModifiedDate DESC';
        
        List<AnalyticsEvent__c> events = null;
        
        System.debug('query: ' + query);
       
        try {
            events = Database.query(query);
        } catch (System.QueryException qe) {
        }

        Map<String, Object> record = null;
        List<Map<String, Object>> records = new List<Map<String,Object>>();
        String timestamp = null;
        
        Boolean match = false;
        
        for (AnalyticsEvent__c event : events) {
            match = false;
            record = new Map<String, Object>();
            record.put('name', event.name);
            record.put('uid', event.id);
            record.put('id', event.id__c);
            record.put('type', event.type__c);
            record.put('step', event.step__c);
            record.put('dataset_name', event.dataset_name__c);
            record.put('selection', event.selection__c);
            record.put('username', event.LastModifiedBy.Username);
            record.put('userId', event.LastModifiedBy.Id);
            record.put('timestamp', event.LastModifiedDate.getTime());
            
            System.debug('match: ' + match);
            
            if (step == null && field == null) {
                match = true;
                record.put('fields', event.fields__c);                
            }
            
            if (step != null) {
                List<String> steps = event.step__c.split(',');
                for (String s : steps) {
                    System.debug('s: ' + s + ', step: ' + step);
                    if (s == step) {
                        record.put('step', event.step__c);
                        match = true;
                        break;
                    }
                }
            }

            if (field != null) {
                List<String> fields = event.fields__c.split(',');
                for (String f : fields) {
                    System.debug('f: ' + f + ', field: ' + field);
                    if (f == field) {
                        System.debug('setting match to true ' + (f == field));
                        match = true;
                        break;
                    }
                }
            }
                
            System.debug('match: ' + match);
            if (match == true) {
                record.put('fields', event.fields__c);
                records.add(record);
            }
        }
        
        return records;
    }

    @AuraEnabled
    global static Map<String, Object> getSelections() {
    
        System.debug('getSelections');

        Map<String, Object> selections = new Map<String, Object>();
        
        List<AnalyticsEvent__c> events = [SELECT name,id__c,step__c,dataset_name__c,fields__c FROM AnalyticsEvent__c];
        
        Map<String, Object> names = new Map<String, Object>();
        Map<String, Object> ids = new Map<String, Object>();
        Map<String, Object> steps = new Map<String, Object>();
        Map<String, Object> dataset_names = new Map<String, Object>();
        Map<String, Object> fields = new Map<String, Object>();
        
        for (AnalyticsEvent__c event : events) {
            System.debug('event: ' + event.name + ', ' + event.id__c + ', ' + event.step__c + ' ' + event.fields__c);
            names.put(event.name, true);
            ids.put(event.id__c, true);
            steps.put(event.step__c, true);
            dataset_names.put(event.dataset_name__c, true);
            fields.put(event.fields__c, true);
        }
        
        selections.put('names', names);
        selections.put('ids', ids);
        selections.put('steps', steps);
        selections.put('dataset_names', dataset_names);
        selections.put('fields', fields);
        
        return selections;
    }

}