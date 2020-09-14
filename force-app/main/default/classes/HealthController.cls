global class HealthController {
    
    @AuraEnabled
    global static Product2 lookupProductIdByUPCCode(String code) {
        Product2 product = [SELECT Id FROM Product2 WHERE eadx__UPC_Code__c =: code];
        return product;
    }
    
    @AuraEnabled
    global static Product2 lookupProductByUPCCode(String code) {
        Product2 product = [SELECT Id,Name,eadx__UPC_Code__c,eadx__Image_URL__c FROM Product2 WHERE eadx__UPC_Code__c =: code];
        return product;
    }
    
    @AuraEnabled
    global static eadx__Wine__c lookupWineByUPCCode(String code) {
        eadx__Wine__c wine = [SELECT Id,Name,eadx__Description__c,eadx__UPC_Code__c,eadx__Image_URL__c,eadx__Winery__c,eadx__Year__c,eadx__Price__c,eadx__Points__c,eadx__Variety__c FROM eadx__Wine__c WHERE eadx__UPC_Code__c =: code];
        return wine;
    }

    @AuraEnabled
    global static String execQuery(String query) {    
        System.debug('query: ' + query);
        ConnectApi.LiteralJson result =  ConnectApi.Wave.executeQuery(query);
        System.debug('result: ' + result);
        System.debug('json: ' + result.json);
        return result.json;
    }
    
    @AuraEnabled
    global static String buildQuery(String queryDef) {    
        System.debug('queryDef: ' + queryDef);
        
        Map<String, Object> q = (Map<String, Object>) JSON.deserializeUntyped(queryDef);
		System.debug('q: ' + q);
        
        String datasetName = (String) q.get('datasetName');
        System.debug('datasetName: ' + datasetName);
        
        //List<Map<String, Object>> fields = (List<Map<String, Object>>) q.get('fields');
        List<Object> fields = (List<Object>) q.get('fields');
        System.debug('fields: ' + fields);
        
        List<Object> orderList = (List<Object>) q.get('orders');
        List<List<String>> orders = new List<List<String>>();
        if (orderList != null) {
	        orders = new List<List<String>>();
            List<String> order;
            List<Object> o;
            for (Object orderObj: orderList) {
                o = (List<Object>) orderObj;
                order = new List<String>();
                for (Object obj: o) {
                    order.add((String) obj);
                }
                orders.add(order);
            }
        }
		System.debug('orders: ' + orders);
        
        List<Object> filterList = (List<Object>) q.get('filters');
        System.debug('filterList: ' + filterList);
        List<String> filters = null;
        if (filterList != null) {
	        filters = new List<String>();
            String filter;
            for (Object filterObj: filterList) {
                filter = (String) filterObj;
                filters.add(filter);
            }
        }
        System.debug('filters: ' + filters);
        
        List<Wave.ProjectionNode> projs = new List<Wave.ProjectionNode>();
        
        Map<String, Object> f;
        String name = null;
        String alias = null;
        
		for (Object field: fields) {
            f = (Map<String, Object>) field;
            name = (String) f.get('name');
            alias = (String) f.get('alias');
            alias = alias.replace('.', '_');
            projs.add(Wave.QueryBuilder.get('\'' + name + '\'').alias('\'' + alias + '\''));
        }
        
        System.debug('projs: ' + projs);
        
        Integer lim = (Integer) q.get('limit');
        System.debug('lim: ' + lim);
        
        //Wave.QueryBuilder.get('Amount').max().alias('max_Amount')
        
        //List<List<String>> orders = new List<List<String>>{new List<String>{'max_Amount', 'desc'}};
        
        Wave.QueryNode node = null;
        node = Wave.QueryBuilder.loadByDeveloperName(datasetName);
        
        node = node.foreach(projs);
        
        if (filters != null) {
        	node = node.filter(filters);
        }
        
        if (orders != null) {
	        node = node.order(orders);
        }
        
        if (lim != null) {
	        node = node.cap(lim);
        }
        
        String query = node.build('q');
        
        //String query = Wave.QueryBuilder.loadByDeveloperName(datasetName).foreach(projs).filter(filters).order(orders).cap(lim).build('q');
        
        System.debug('query: ' + query);


		ConnectApi.LiteralJson result = ConnectApi.Wave.executeQuery(query);
        
        System.debug('result: ' + result);
        System.debug('json: ' + result.json);
        return result.json;
    }
    

    
}