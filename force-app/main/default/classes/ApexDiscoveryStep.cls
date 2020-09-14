@RestResource(urlMapping='/apexdiscovery/*') 
global with sharing class ApexDiscoveryStep {

    @HttpGet
    global static void getStories() {

        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        
		String storyId = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
        
        String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
		String url = baseUrl + '/services/data/v47.0/smartdatadiscovery/analyses';
        url += storyId != null ? '/' + storyId : '';

        System.debug('url: ' + url);
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('X-Chatter-Entity-Encoding', 'false');
		request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());        
        
        HTTPResponse response = http.send(request);

        String body = response.getBody().replaceAll('\\"', '"');
        
        RestContext.response.addHeader('Content-Type', 'application/json');
       	RestContext.response.responseBody = Blob.valueOf(body);
    }
/*    
    global static List<Object> getStory(String id) {
        String url = '/services/data/v47.0/smartdatadiscovery/proxy';
        
        String config = 'grant_type=password';
        config += '&client_id=' + clientId;
        config += '&client_secret=' + clientSecret;
        config += '&username=' + username;
        config += '&password=' + password;        
        
        String config = '';
        config += '{';
        config += '"analysisId":"' + id + '",';
        config += '"payload":{';
        config += '"url":"/v47.0/discovery/analyses/' + id + '",';
        config += '"body":{';
        config += '"analysi":"' + id + '",';
        config += '"analysisId":"' + id + '",';
        config += '"analysisId":"' + id + '",';
        config += '"analysisId":"' + id + '",';
        

        
        
        var body = {
            analysisId: analysisId,
            payload: {
                url: '/v47.0/discovery/analyses/' + analysisId,
                body: {
                    analysisConfiguration: analysisDetails.setup
                }
            }
        };        
        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('POST');
        request.setHeader('Content-type', 'application/json');
        //request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        request.setBody('{"config":' + config + '}');
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();           
    }
*/   
    
    global static StoryInsightCache__c getStoryInsightCache(String storyId, String insightIndex) {
        System.debug('getStoryInsightCache - storyId:' + storyId + ', insightIndex: ' + insightIndex);
		List<StoryInsightCache__c> caches = [SELECT Id,Name,StoryId__c, InsightIndex__c,Body__c FROM StoryInsightCache__c WHERE (StoryId__c =: storyId AND InsightIndex__c =: insightIndex)];
        System.debug('caches: ' + caches);
		return caches.size() > 0 ? caches.get(0) : null; 
    }
    
    @HttpPost
    global static void getStoryChart(String insightIndex) {

        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        
		String storyId = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);
        
        StoryInsightCache__c insightCache = getStoryInsightCache(storyId, insightIndex);
        if (insightCache != null) {
            
            String insightBody = JSON.serialize(insightCache.Body__c);
            System.debug('MATCH: ' + insightBody);
			        
            String body = insightBody.replaceAll('\\"', '"');

            System.debug('body: ' + body);
            
        	RestContext.response.addHeader('Content-Type', 'application/json');
       		RestContext.response.responseBody = Blob.valueOf(body);  
        } else {
            
            
            String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
            String url = baseUrl + '/services/data/v47.0/smartdatadiscovery/analyses/' + storyId;
            
            System.debug('url: ' + url);
            
            HttpRequest request = new HttpRequest();        
            Http http = new Http();
            request.setEndpoint(url);
            request.setMethod('GET');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Accept', 'application/json');
            request.setHeader('X-Chatter-Entity-Encoding', 'false');
            request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());        
            
            HTTPResponse response = http.send(request);
            
            String body = response.getBody().replaceAll('\\"', '"');
            
            Map<String, Object> details = (Map<String, Object>) JSON.deserializeUntyped(body);
            
            Map<String, Object> setup = (Map<String, Object>) details.get('setup');
            
            Map<String, Object> storyConfig = new Map<String, Object>();
            
            storyConfig.put('analysisId', storyId);
            
            Map<String, Object> payload = new Map<String, Object>();
            payload.put('url', '/v47.0/discovery/analyses/' + storyId);
            
            Map<String, Object> payloadBody = new Map<String, Object>();
            payloadBody.put('analysisConfiguration', setup);
            
            payload.put('body', payloadBody);        
            
            storyConfig.put('payload', payload);
            
            RestContext.response.addHeader('Content-Type', 'application/json');
            RestContext.response.responseBody = Blob.valueOf(body);
            
            url = baseUrl + '/services/data/v47.0/smartdatadiscovery/proxy';        
            
            request = new HttpRequest();        
            http = new Http();
            request.setEndpoint(url);
            request.setMethod('POST');
            request.setHeader('Content-type', 'application/json');
            request.setHeader('Accept', 'application/json');
            request.setHeader('X-Chatter-Entity-Encoding', 'false');
            request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());        
            
            request.setBody(JSON.serialize(storyConfig));
            
            response = http.send(request);
            
            body = response.getBody(); //.replaceAll('\\"', '"');
            
            // Cache the insights
            Map<String, Object> story = (Map<String, Object>) JSON.deserializeUntyped(body);
            Map<String, Object> storyBody = (Map<String, Object>) story.get('Body');
            List<Object> insights = (List<Object>) storyBody.get('insights');
            
            StoryInsightCache__c cache = null;
            Integer idx = 0;
            Map<String, Object> matchedInsight = null;            
            Map<String, Object> insight = null;
            for (Object insightObj : insights) {
                insight = (Map<String, Object>) insightObj;
                System.debug('insight: ' + insight);
                if ('' + idx == insightIndex) {
                    matchedInsight = insight;
                }
                cache = new StoryInsightCache__c();
                cache.StoryId__c = storyId;
                cache.InsightIndex__c = '' + idx;
                cache.Body__c = JSON.serialize(insight);
                UPSERT cache;
                idx++;
            }
            
            System.debug('matchedInsight: ' + matchedInsight);
            
            String matchedInsightBody = JSON.serialize(matchedInsight);
            
            System.debug('matchedInsightBody: ' + matchedInsightBody);
            
            RestContext.response.addHeader('Content-Type', 'application/json');
            RestContext.response.responseBody = Blob.valueOf((String) matchedInsight.get('body'));
        }
            /*        
List<Object> records = new List<Object>();        

List<String> strings = new List<String>();
List<String> numbers = new List<String>();
List<String> groupings = new List<String>();

Map<String, Object> response = new Map<String, Object>();
Map<String, Object> metadata = new Map<String, Object>();
metadata.put('strings', strings);
metadata.put('numbers', numbers);
metadata.put('groupings', groupings);

response.put('data', records);
response.put('metadata', metadata);

return JSON.serialize(response);        
*/
    }

    
}