global with sharing class SkoDemoInvocable{
    
    @InvocableMethod(
        label='SKO Demo' 
        description='Handles the SKO Demo use cases'
    )
    global static List<Response> performOperation(List<Request> requests) {
        System.debug('SkoDemoInvocable.performOperation');
        return new SkoDemoInvocable(requests.get(0)).doAutoInvoke();
    }
            
    global class Request {    
        @InvocableVariable(required=true)
        global String objectName;

        @InvocableVariable(required=true)
        global String objectType;

        @InvocableVariable(required=true)
        global String fieldLabel;
    }
    
    global class Response {
        @InvocableVariable
        global String objectName;

        @InvocableVariable
        global String objectType;

        @InvocableVariable
        global String fieldLabel;

        @InvocableVariable
        global String fieldName;

        @InvocableVariable
        global String fieldType;

        @InvocableVariable
        global String fieldValue;

        @InvocableVariable
        global String speech;

        @InvocableVariable
        global String text;
    }
    
    private final Request request;
    public SkoDemoInvocable(Request request) {
        System.debug('SkoDemoInvocable constructor');
        this.request = request;
        if (null != this.request){
            System.debug('objectName: ' + this.request.objectName);
            System.debug('objectType: ' + this.request.objectType);
            System.debug('fieldLabel: ' + this.request.fieldLabel);
        }
    }

    public SkoDemoInvocable() {
        this(null);
        System.debug('SkoDemoInvocable default constructor');
    }
    
    public List<Response> doAutoInvoke() {
        System.debug('SkoDemoInvocable.doAutoInvoke');    
        if (null == this.request){
            Exception e = new NullPointerException();
            e.setMessage('Invocable request not set.');
            throw e;
        }

        String objectName = request.objectName;
        String objectType = request.objectType;
        String fieldLabel = request.fieldLabel;

        Map<String, Object> params = new Map<String, Object>();
        params.put('objectName', objectName);
        params.put('objectType', objectType);
        params.put('fieldLabel', fieldLabel);

        List<Map<String, Object>> results = SkoDemoUtils.execQuery(params);
        Map<String, Object> result = results.get(0);
        
        Response response = new Response();
        response.objectName = (String) result.get('objectName');
        response.objectType = (String) result.get('objectType');
        response.fieldLabel = (String) result.get('fieldLabel');
        response.fieldName = (String) result.get('fieldName');
        response.fieldType = (String) result.get('fieldType');
        response.fieldValue = (String) result.get(response.fieldName);
        response.speech = (String) result.get('speech');
        response.text = (String) result.get('text');

        List<Response> rv = new List<Response>();
        rv.add(response);
        
        return rv;

    }
}