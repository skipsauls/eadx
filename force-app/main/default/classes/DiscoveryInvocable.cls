global with sharing class DiscoveryInvocable implements Database.AllowsCallouts {
    
    @InvocableMethod(
        label='Einstein Discovery' 
        description='Handles Einstein Discovery use cases'
    )
    global static List<Response> performOperation(List<Request> requests) {
        System.debug('DiscoveryInvocable.performOperation');
        return new DiscoveryInvocable(requests.get(0)).doAutoInvoke();
    }
            
    global class Request {    
        @InvocableVariable(required=true)
        global String storyName;

        @InvocableVariable(required=true)
        global String query;

        @InvocableVariable(required=false)
        global Integer index;

        @InvocableVariable(required=false)
        global Boolean full;
        
    }
    
    global class Response {
        @InvocableVariable
        global String storyName;

        @InvocableVariable
        global String query;

        @InvocableVariable
        global Integer index;

        @InvocableVariable
        global Boolean full;

        @InvocableVariable
        global String insights;

        @InvocableVariable
        global String metadata;

        @InvocableVariable
        global String improvements;

        @InvocableVariable
        global String model;

        @InvocableVariable
        global String speech;

        @InvocableVariable
        global String text;
    }
    
    private final Request request;
    public DiscoveryInvocable(Request request) {
        System.debug('DiscoveryInvocable constructor');
        this.request = request;
        if (null != this.request){
            System.debug('storyName: ' + this.request.storyName);
            System.debug('query: ' + this.request.query);
        }
    }

    public DiscoveryInvocable() {
        this(null);
        System.debug('DiscoveryInvocable default constructor');
    }
    
    public List<Response> doAutoInvoke() {
        System.debug('DiscoveryInvocable.doAutoInvoke');    
        if (null == this.request){
            Exception e = new NullPointerException();
            e.setMessage('Invocable request not set.');
            throw e;
        }

        String storyName = request.storyName;
        String query = request.query;
        Integer index = request.index >= 0 ? (request.index - 1) : 0;
        Boolean full = request.full == true ? true : false;

        Map<String, Object> params = new Map<String, Object>();
        params.put('storyName', storyName);
        params.put('query', query);
/*
        List<Map<String, Object>> results = SkoDemoUtils.execQuery(params);
        Map<String, Object> result = results.get(0);
*/        
        Response response = new Response();
        response.storyName = storyName;
        response.query = query;
        response.index = index;
        response.full = full;
        
        String analysisId = '9B4B0000000PGFeKAO';
        
        String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
        
        String url = baseUrl + '/services/data/v47.0/smartdatadiscovery/analyses/' + analysisId;
        
        System.debug('url: ' + url);
        
        HttpRequest req = new HttpRequest();        
        Http http = new Http();
        req.setEndpoint(url);
        req.setMethod('GET');
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
        
        HTTPResponse res = http.send(req);

        String body = res.getBody(); 
        
        System.debug('body: ' + body);

        Map<String, Object> obj = (Map<String, Object>) JSON.deserializeUntyped(body);
        Map<String, Object> setup = (Map<String, Object>) obj.get('setup');
        System.debug('setup: ' + setup);
        
        url = baseUrl + '/services/data/v47.0/smartdatadiscovery/proxy';
        
        Map<String, Object> payload = new Map<String, Object>();
        payload.put('url', '/v46.0/discovery/analyses/' + analysisId);
        payload.put('body', setup);

        Map<String, Object> proxyBody = new Map<String, Object>();
        proxyBody.put('analysisId', analysisId);
        proxyBody.put('payload', payload);
        
        
        String config = JSON.serialize(proxyBody);
        
        System.debug('config: ' + config);

		req = new HttpRequest();        
        http = new Http();
        req.setEndpoint(url);
        req.setMethod('POST');
        req.setBody(config);
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
        
		res = http.send(req);

        body = res.getBody(); 
        
        System.debug('body: ' + body);


		obj = (Map<String, Object>) JSON.deserializeUntyped(body);
        Map<String, Object> analysesBody = (Map<String, Object>) obj.get('Body');
        List<Object> improvements = (List<Object>) analysesBody.get('improvements');
        List<Object> insights = (List<Object>) analysesBody.get('insights');
        Map<String, Object> metadata = (Map<String, Object>) analysesBody.get('metadata');
        Map<String, Object> model = (Map<String, Object>) analysesBody.get('model');
        
        if (full == true) {
            response.improvements = JSON.serialize(improvements);
            response.insights = JSON.serialize(insights);
            response.metadata = JSON.serialize(metadata);
            response.model = JSON.serialize(model);
        }
        
        Map<String, Object> insight = null;
        Map<String, Object> narrative = null;
        Map<String, Object> narrativeBody = null;
        List<Object> elements = null;
        Map<String, Object> firstElement = null;
        List<Object> subElements = null;
        Map<String, Object> subElement = null;
        String type = null;
        String value = null;
        String text = '';
        String speech = '';
        
        //for (Object i: insights) {
        //    insight = (Map<String, Object>) i;
    
        insight = (Map<String, Object>) insights.get(index);
        System.debug('insight: ' + insight);
        narrative = (Map<String, Object>) insight.get('narrative');
        narrativeBody = (Map<String, Object>) narrative.get('body');
        elements = (List<Object>) narrativeBody.get('elements');
        firstElement = (Map<String, Object>) elements.get(0);
        subElements = (List<Object>) firstElement.get('elements');
        for (Object e: subElements) {
            subElement = (Map<String, Object>) e;
            type = (String) subElement.get('type');
            value = (String) subElement.get('value');
            text += value;
        }
        
        //}
        
        speech = '<speak>' + text + '</speak>';
        
        response.text = text;
        response.speech = speech;
/*        
        response.fieldLabel = (String) result.get('fieldLabel');
        response.fieldName = (String) result.get('fieldName');
        response.fieldType = (String) result.get('fieldType');
        response.fieldValue = (String) result.get(response.fieldName);
        response.speech = (String) result.get('speech');
        response.text = (String) result.get('text');
*/
        
        List<Response> rv = new List<Response>();
        rv.add(response);
        
        return rv;

    }
}