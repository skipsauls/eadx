global with sharing class AnalyticsVoiceAliasInvocable implements Database.AllowsCallouts {
    
    @InvocableMethod(
        label='Einstein Analytics Voice Aliases' 
        description='Handles Einstein Analytics Voice Aliases use cases'
    )
    global static List<Response> performOperation(List<Request> requests) {
        System.debug('AnalyticsVoiceAliasInvocable.performOperation');
        return new AnalyticsVoiceAliasInvocable(requests.get(0)).doAutoInvoke();
    }
            
    global class Request {    
        @InvocableVariable(required=false)
        global String aliasName;

        @InvocableVariable(required=false)
        global String query;

        @InvocableVariable(required=false)
        global Integer max;
        
    }
    
    global class Response {
        @InvocableVariable
        global String aliasName;

        @InvocableVariable
        global String query;

        @InvocableVariable
        global Integer max;

        @InvocableVariable
        global String speech;

        @InvocableVariable
        global String text;
    }
    
    private final Request request;
    public AnalyticsVoiceAliasInvocable(Request request) {
        System.debug('AnalyticsVoiceAliasInvocable constructor');
        this.request = request;
        if (null != this.request){
            System.debug('aliasName: ' + this.request.aliasName);
            System.debug('query: ' + this.request.query);
        }
    }

    public AnalyticsVoiceAliasInvocable() {
        this(null);
        System.debug('AnalyticsVoiceAliasInvocable default constructor');
    }
    
    public List<Response> doAutoInvoke() {
        System.debug('AnalyticsVoiceAliasInvocable.doAutoInvoke');    
        if (null == this.request){
            Exception e = new NullPointerException();
            e.setMessage('Invocable request not set.');
            throw e;
        }

        String aliasName = request.aliasName;
        String query = request.query;
        Integer max = request.max >= 0 ? request.max : 1;

        Map<String, Object> params = new Map<String, Object>();
        params.put('aliasName', aliasName);
        params.put('query', query);
      
        /* This is just reflecting the values */
        Response response = new Response();
        response.aliasName = aliasName;
        response.query = query;
        response.max = max;

        List<Response> rv = new List<Response>();
        rv.add(response);
        
        return rv;
        
		/* Note that we can't call APIs from Lightning, so this won't work for utility bar!
		 * 
		 */
		/*        
        String results = AnalyticsVoiceUtils.getVoiceAliasResults(aliasName);
        
        System.debug('results: '+ results);
        
        String speech = '<speak>' + results + '</speak>';
        
        response.text = results;
        response.speech = speech;

        List<Response> rv = new List<Response>();
        rv.add(response);

        return rv;
        */

    }
}