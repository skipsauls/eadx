@RestResource(urlMapping='/twitterlim/*') 
global with sharing class ApexTwitterLimitsController {

    private class LimitsWrapper {
        private String type;
        private String url;
        private Integer lim;
        private Integer remaining;
        private Integer reset;
        private String reset_time;
        
        private LimitsWrapper(String type, String url, Integer lim, Integer remaining, Integer reset) {
            this.type = type;
            this.url = url;
            this.lim = lim;
            this.remaining = remaining;
            this.reset = reset;
            DateTime dt = DateTime.newInstance(reset * 1000);
            this.reset_time = dt.format();

        }
    }
    
    @AuraEnabled
    global static String getAppRateLimit(String resources) {
    
        String body = ApexTwitterUtils.getAppRateLimit(resources);
        
        return body;
    }
    
        
    @HttpPost            
    global static void getLimits(String resources, Boolean all, String dummy) {
    
        List<String> strings = new List<String>();
        List<String> numbers = new List<String>();
        List<String> groupings = new List<String>();

        String body = ApexTwitterUtils.getAppRateLimit(resources);
        
        List<LimitsWrapper> xlimits = new List<LimitsWrapper>();
        LimitsWrapper xlimit = null;
        
        Map<String, Object> limits = (Map<String, Object>) JSON.deserializeUntyped(body);
        
        Map<String, Object> resourceMap = (Map<String, Object>) limits.get('resources');
        
        Integer lim = null;
        Integer remaining = null;
        Integer reset = null;
        
        for (String type : resourceMap.keySet()) {
            Map<String, Object> resource = (Map<String, Object>) resourceMap.get(type);
            for (String url: resource.keySet()) {
                Map<String, Object> values = (Map<String, Object>) resource.get(url);
                lim = (Integer) values.get('limit');
                remaining = (Integer) values.get('remaining');
                reset = (Integer) values.get('reset');
                
                xlimit = new LimitsWrapper(type, url, lim, remaining, reset);
                xlimits.add(xlimit);
            }
        }
        
        strings.add('type');
        strings.add('url');
        
        numbers.add('remaining');
        
        if (all == true) {
            numbers.add('lim');
            numbers.add('reset');
            
            strings.add('reset_time');
        }
        
        groupings.add('url');
        groupings.add('type');
        
        //String body2 = JSON.serialize(xlimits);

        
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings);
            
        String body2 = JSON.serialize(new PackagedReturnItem(xlimits, rm));
        
        RestContext.response.addHeader('Content-Type', 'application/json');
        RestContext.response.responseBody = Blob.valueOf(body2);        
            
    }
    
    // Get the metadata from the query response 
    private static void getQueryMetadata(List<String> strings, List<String> numbers, List<Object> groupings, Map<String, Object> resultMap) { 
    
        Map<String, Object> metadataMap = (Map<String, Object>)resultMap.get('metadata'); 
        List<Object> columns = (List<Object>)metadataMap.get('columns'); 
    
        for(Integer i = 0 ; i < columns.size(); i++) { 
            Map<String, Object> curColumn = (Map<String, Object>) columns[i]; 
            if(curColumn.get('type') == 'Numeric') { 
                numbers.add((String)curColumn.get('name')); 
            } else { 
                strings.add((String)curColumn.get('name')); 
            } 
        } 
        groupings = (List<Object>) metadataMap.get('groups'); 
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