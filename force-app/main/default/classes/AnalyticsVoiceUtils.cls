global class AnalyticsVoiceUtils implements Database.AllowsCallouts {

    global static String convertFieldLabelToFieldName(String fieldLabel) {
        List<String> parts = fieldLabel.split(' ');
        System.debug('parts: ' + parts);
        List<String> cappedParts = new List<String>();
        String fieldName = '';
        String sep = '';
        for (String part: parts) {
            fieldName += sep + part.substring(0, 1).toUpperCase() + part.substring(1);
            sep = '_';
        }
        //System.debug('fieldName: ' + fieldName);    
        return fieldName;
    }

    global static String convertFieldNameToFieldLabel(String fieldName) {
        return fieldName.replace('_', ' ');
    }
    
    global static List<String> fieldNames = new List<String> {
        'Account_Owner', 'Account_Id', 'EA_co_prime', 'RVP', 'AVP', 'Success_Manager', 'Account_Name', 'Product_Family',
        'Segment', 'Usage_Trend', 'Country', 'Implmentation_Partner', 'States', 'EA_Academies', 'Einstein_Analytics_Trial',
        'Pipe_Coverage', 'Standard_Object_Rows', 'Custom_Object_Rows', 'Custom_Objects', 'ACV', 'EWS_Score'
    };
    
	global static Map<String, String> fieldMap = new Map<String, String> {
		'Account_Owner' => 'Dimension',
		'Account_Id' => 'Dimension',
		'EA_co-prime' => 'Dimension',
		'Product_Family' => 'Dimension',
		'Success_Manager' => 'Dimension',
		'RVP' => 'Dimension',
		'AVP' => 'Dimension',
		'Segment' => 'Dimension',
		'Usage_Trend' => 'Dimension',
		'Country' => 'Dimension',
		'Implementation_Partner' => 'Dimension',
		'States' => 'Dimension',
		'EA_Academies' => 'Dimension',
		'Einstein_Analytics_Trial' => 'Dimension',
		'Pipe_Coverage' => 'Measure',
		'Standard_Object_Rows' => 'Measure',
		'Custom_Object_Rows' => 'Measure',
		'Custom_Objects' => 'Measure',
		'ACV' => 'Measure',
		'EWS_Score' => 'Measure'
	};
            
    global static List<Map<String, Object>> execQuery(Map<String, Object> params) {
        String fieldLabel = (String) params.get('fieldLabel');
        String objectName = (String) params.get('objectName');
        String objectType = (String) params.get('objectType');

        //System.debug('fieldLabel: ' + fieldLabel);
        //System.debug('objectName: ' + objectName);
        //System.debug('objectType: ' + objectType);
        
        // Use pattern to camelcase and underscore the label
        // Best would be to look in dataset, xmd, etc. to find the best match
        
        //String fieldName = convertFieldLabelToFieldName(fieldLabel); //Account_Owner';

        //Integer fieldNameIndex = findBestMatch(fieldLabel, fieldNames);
        //String fieldName = fieldNames.get(fieldNameIndex);
        
		String fieldName = findBestMatchFromMap(fieldLabel, fieldMap);
        
        System.debug('fieldLabel: ' + fieldLabel + ' matched to ' + fieldName);

        String fieldType = fieldMap.get(fieldName);
        
        System.debug('fieldType: ' + fieldType);
        
        List<Map<String, String>> dimensions = new List<Map<String, String>>();
        List<Map<String, String>> measures = new List<Map<String, String>>();
        List<String> groups = new List<String>();        
        List<List<String>> orders = new List<List<String>>();
        List<String> filters = new List<String>();
        

        Map<String, String> dimension = null;
        Map<String, String> measure = new Map<String, String>();
        
        if (fieldType == 'Dimension') {
            dimension = new Map<String, String>();
            dimension.put('fieldName', fieldName);
            dimensions.add(dimension);
            groups.add(fieldName);
        } else if (fieldType == 'Measure') {
            measure = new Map<String, String>();
            measure.put('fieldName', fieldName);
            measures.add(measure);        
        }

        String filterFieldName = objectType + '_Name';
        String filterFieldValue = objectName;
        
        //System.debug('filterFieldName: ' + filterFieldName);
        //System.debug('filterFieldValue: ' + filterFieldValue);
        
        dimension = new Map<String, String>();
        dimension.put('fieldName', filterFieldName);
        dimensions.add(dimension);
        
        List<String> order = new List<String>();
        order.add(fieldName);
        order.add('asc');
        orders.add(order);
        
        
        //String filter = filterFieldName + ' == ' + '"' + filterFieldValue + '"';
        String filter = filterFieldName + ' matches ' + '"' + filterFieldValue.substring(0, 2) + '"';
        filters.add(filter);
        
        //groups.add(fieldName);
        groups.add(filterFieldName);
        
        List<Object> records = executeQuery(dimensions, measures, groups, orders, filters);
        //System.debug('executeQuery returned records: ' + records);
        
        //Map<String, Object> record = null;
        
        // Iterate over all records to get names to match
        List<String> names = new List<String>();
        for (Object record: records) {
            Map<String, Object> recordMap = (Map<String, Object>) record;
            /*
            for (String key: recordMap.keySet()) {
                System.debug('record: ' + key + ' = ' + recordMap.get(key));
            }
			*/
            names.add((String) recordMap.get(filterFieldName));
        }
        
        Integer bestMatch = findBestMatch(filterFieldValue, names);
        //System.debug('bestMatch: ' + bestMatch);
        
        
        //Map<String, Object> firstRecord = (Map<String, Object>) records.get(0);
        //String fieldValue = (String) firstRecord.get(fieldName);

        Map<String, Object> matchRecord = (Map<String, Object>) records.get(bestMatch);
        System.debug('matchRecord: ' + matchRecord);
        String fieldValue = '' + matchRecord.get(fieldName);

		// Get the actual field name
        String fieldNameOutput = (String) matchRecord.get(filterFieldName);
        
        List<Map<String, Object>> results = new List<Map<String, Object>>();
        Map<String, Object> result = new Map<String, Object>();

        //String text = fieldValue + ' is the ' + fieldLabel + ' for the ' + objectName + ' ' + objectType + '.';
        
        String fieldLabelOutput = convertFieldNameToFieldLabel(fieldName);
        
        String text = fieldValue + ' is the ' + fieldLabelOutput + ' for ' + fieldNameOutput + '.';
        String speech = text;
        
        result.put('objectName', objectName);
        result.put('objectType', objectType);
        result.put('fieldLabel', fieldLabel);
        result.put('fieldName', fieldName);
        result.put('Account_Id', '12r123r1234r12342');
        result.put('Account_Name', 'John Doe');
        result.put('speech', speech);
        result.put('text', text);
        results.add(result);
        return results;
    }
    
    public static List<Object> executeQuery(List<Map<String, String>> dimensions, List<Map<String, String>> measures, List<String> groups, List<List<String>> orders, List<String> filters) {
    
        List<Wave.ProjectionNode> projs = new List<Wave.ProjectionNode>();
        
        for (Map<String, String> dimension: dimensions) {
            projs.add(Wave.QueryBuilder.get(dimension.get('fieldName')));
        }
        
        for (Map<String, String> measure: measures) {
            projs.add(Wave.QueryBuilder.get(measure.get('fieldName')).max().alias(measure.get('fieldName')));
        }
        
        /*
        Wave.ProjectionNode[] projs = new Wave.ProjectionNode[]{
            Wave.QueryBuilder.get('Name'),
            Wave.QueryBuilder.get('Amount').max().alias('max_Amount')
        };
        */
        //List<List<String>> orders = new List<List<String>>(); //{new List<String>{'max_Amount', 'desc'}};

        // Note that filters are removed!!!!!!!!!!!!!!
        // 
        //String query = Wave.QueryBuilder.loadByDeveloperName('eadx__EA_Commander_Demo_300').group(groups).foreach(projs).order(orders).cap(300).build('q');    
        //System.debug('query: ' + query);
         
        ConnectApi.LiteralJson result = Wave.QueryBuilder.loadByDeveloperName('eadx__EA_Commander_Demo_300').group(groups).foreach(projs).order(orders).cap(300).execute('q');    
        
        String response = result.json;
        
        Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(response);
        Map<String, Object> results = (Map<String, Object>) m.get('results');
        List<Object> records = (List<Object>) results.get('records');
        
        return records;  
    
    }
    
    public class Dataset {
        public String id;
        public String name;
        public String namespace;
    }
    
    public class Configuration {
        public List<Dataset> datasets;
        public String query;
    }
    
    public class Condition {
        public String colName;
        public String operation;
        public String value;
    }
    
    public class Threshold {
        public List<Condition> conditions;
        public String type;
    }
    
    public class VoiceAlias {
        public Boolean active;
        public String id;
        public String name;
        public String recordId;
        public List<Threshold> thresholds;
        public Configuration configuration;
    }
    
    public static List<AnalyticsVoiceUtils.VoiceAlias> listVoiceAliases() {
        
        System.debug('URL.getSalesforceBaseUrl(): ' + URL.getSalesforceBaseUrl());
        System.debug('URL.getOrgDomainUrl(): ' + URL.getOrgDomainUrl());
        String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
        
        String url = baseUrl + '/services/data/v47.0/analytics/notifications?source=waveNotification';
        
        System.debug('url: ' + url);
        
        HttpRequest req = new HttpRequest();        
        Http http = new Http();
        req.setEndpoint(url);
        req.setMethod('GET');
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        
        HTTPResponse res = http.send(req);

        String body = res.getBody(); 
        
        System.debug('body: ' + body);

        List<Object> aliases = (List<Object>) JSON.deserializeUntyped(body);
        List<AnalyticsVoiceUtils.VoiceAlias> voiceAliases = new List<AnalyticsVoiceUtils.VoiceAlias>();
        
        for (Object v: aliases) {
            System.debug('v: ' + v);
            AnalyticsVoiceUtils.VoiceAlias voiceAlias = (AnalyticsVoiceUtils.VoiceAlias) JSON.deserialize(JSON.serialize(v), VoiceAlias.class);
            System.debug('voiceAlias: ' + voiceAlias);
            voiceAliases.add(voiceAlias);
        }
        
        return voiceAliases;
    }
    
    public static AnalyticsVoiceUtils.VoiceAlias getVoiceAlias(String aliasName) {
        List<AnalyticsVoiceUtils.VoiceAlias> voiceAliases = listVoiceAliases();
        AnalyticsVoiceUtils.VoiceAlias voiceAlias;
        for (AnalyticsVoiceUtils.VoiceAlias v: voiceAliases) {
            if (v.name == aliasName) {
                voiceAlias = v;
            }
        }
        return voiceAlias;
    }


    public static List<Map<String, Object>> execVoiceAlias(String aliasName) {
        List<AnalyticsVoiceUtils.VoiceAlias> voiceAliases = listVoiceAliases();
        AnalyticsVoiceUtils.VoiceAlias voiceAlias;
        for (AnalyticsVoiceUtils.VoiceAlias v: voiceAliases) {
            if (v.name == aliasName) {
                voiceAlias = v;
            }
        }
        System.debug('voiceAlias: ' + voiceAlias);
		System.debug('query: ' + voiceAlias.configuration.query);
        
        for (Dataset d: voiceAlias.configuration.datasets) {
            System.debug('dataset: ' + d);
        }
        
        List<Object> recs = execQuery(voiceAlias.configuration.datasets, voiceAlias.configuration.query);
        System.debug('recs: ' + recs);
           
        List<Map<String, Object>> records = new List<Map<String, Object>>();

        Map<String, Object> record = null;
        for (Object r: recs) {
            record = (Map<String, Object>) r;
            System.debug('>>>>>>>>>>>>>>>>>>>> record: ' + record);
            records.add(record);
        }
        
        return records;
/*        
        String result = '';
        
        Map<String, Object> record = null;
        for (Object r: records) {
            record = (Map<String, Object>) r;
            System.debug('>>>>>>>>>>>>>>>>>>>> record: ' + record);
        
            for (Threshold t: voiceAlias.thresholds) {
                System.debug('threshold: ' + t);
                System.debug('threshold type: ' + t.type);
                for (Condition c: t.conditions) {
                    System.debug('condition: ' + c);
                    String colName = c.colName;
                    System.debug('colName: ' + colName);
                    result += record.get(colName);
                }
            }
        
		}
        System.debug('result: ' + result);
        
        return result;
*/
    }
    
    public static String getVoiceAliasResults(String aliasName) {
    	
        CommanderTemplate__c template = [SELECT Id,AssetName__c,Template__c,Type__c FROM CommanderTemplate__c WHERE AssetName__c =: aliasName AND Type__c = 'VoiceAlias' LIMIT 1];
        String result = '';
        
        List<Map<String, Object>> records = AnalyticsVoiceUtils.execVoiceAlias('Revenue by Segment');

		System.debug(records);

        String partial = null;
        Object value = null;
        String sep = '';
        for (Map<String, Object> r: records) {
            partial = template.Template__c;
            System.debug('r: ' + r);
            for (String key: r.keySet()) {
                value = r.get(key);
                System.debug('value: ' + value);
                partial = partial.replace('{{' + key + '}}', String.valueOf(value));
            }
            result += sep + partial;
            //sep = ', ';
        }
        
        return result;
    }
    
    
    public static String convertDatasetNameToCurrentVersionId(Dataset dataset) {

        String name = dataset.name;
        String namespace = dataset.namespace;
        
        String datasetName = (namespace != null) ? namespace + '__' : '';
        datasetName += name;
        
        String q = Wave.QueryBuilder.loadByDeveloperName(datasetName).build('q');
        System.debug('q: ' + q);
        
        String[] datasetVersion = q.split('"', 0);
        String[] ids = datasetVersion[1].split('/', 0);
        
        return datasetVersion[1];
    }
    
    public static List<Object> execQuery(List<Dataset> datasets, String query) {

        String query2 = query;
        String datasetVersion = null;
        String datasetName = null;
        for (Dataset d: datasets) {
            datasetName = (d.namespace != null) ? d.namespace + '__' : '';
            datasetName += d.name;
            datasetVersion = convertDatasetNameToCurrentVersionId(d);
	        query2 = query2.replace(datasetName, datasetVersion);
        }
        /*
        String datasetName = (namespace != null) ? namespace + '__' : '';
        datasetName += name;
        
        String q = Wave.QueryBuilder.loadByDeveloperName(datasetName).build('q');
        System.debug('q: ' + q);
        
        String[] datasetVersion = q.split('"', 0);
        String[] ids = datasetVersion[1].split('/', 0);
        
        Map<String, String> datasetVersionIds = new Map<String, String>();
        datasetVersionIds.put('datasetId', ids[0]);
        datasetVersionIds.put('versionId', ids[1]); 
        */
        
        System.debug('query: ' + query);
        System.debug('query2: ' + query2);

        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query2);
        
        String response = result.json;
        
        Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(response);
        Map<String, Object> results = (Map<String, Object>) m.get('results');
        List<Object> records = (List<Object>) results.get('records');
        
        return records;  
    }    
    
    public static Integer findBestMatch(String text, List<String> names) {
        
        String lcText = text.toLowerCase().deleteWhitespace().replaceAll('[-\\,_]', '');
        String bestMatch = null;
        Integer bestMatchIndex = 0;
        
        Integer lowestScore = 10000000;
        Integer index = 0;
        for (String name : names) {
            //System.debug(index + ' - name: ' + name);
            String lcName = name.toLowerCase().deleteWhitespace().replaceAll('[-\\,_]', '');
            //System.debug('lcName: ' + lcName);
            if (lcText == lcName) {
                // Exact match
                bestMatch = name;
                bestMatchIndex = index;
                break;
            }
            Integer lexScore = lcName.compareTo(lcText);
            String diff = lcName.difference(lcText);
            Integer indexDiff = lcName.indexOfDifference(lcText);
            Integer distance = lcName.getLevenshteinDistance(lcText);
            Integer score = distance - (indexDiff - diff.length());
            if (score < lowestScore) {
                lowestScore = score;
                bestMatch = name;
                bestMatchIndex = index;
            }
            index++;
        }
        //System.debug('bestMatch: ' + bestMatch);
        //System.debug('bestMatchIndex: ' + bestMatchIndex);
        return bestMatchIndex;
    }
    
    public static String findBestMatchFromMap(String text, Map<String, String> values) {
        
        String lcText = text.toLowerCase().deleteWhitespace().replaceAll('[-\\,_]', '');
        String bestMatch = null;
        Integer bestMatchIndex = 0;
        
        Integer lowestScore = 10000000;
        Integer index = 0;
        for (String name : values.keySet()) {
            //System.debug(index + ' - name: ' + name);
            String lcName = name.toLowerCase().deleteWhitespace().replaceAll('[-\\,_]', '');
            //System.debug('lcName: ' + lcName);
            if (lcText == lcName) {
                // Exact match
                bestMatch = name;
                bestMatchIndex = index;
                break;
            }
            Integer lexScore = lcName.compareTo(lcText);
            String diff = lcName.difference(lcText);
            Integer indexDiff = lcName.indexOfDifference(lcText);
            Integer distance = lcName.getLevenshteinDistance(lcText);
            Integer score = distance - (indexDiff - diff.length());
            if (score < lowestScore) {
                lowestScore = score;
                bestMatch = name;
                bestMatchIndex = index;
            }
            index++;
        }
        //System.debug('bestMatch: ' + bestMatch);
        //System.debug('bestMatchIndex: ' + bestMatchIndex);
        return bestMatch;
    }
    
}