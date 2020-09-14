global class SkoDemoUtils {

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