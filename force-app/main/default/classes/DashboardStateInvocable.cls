global with sharing class DashboardStateInvocable {

    @InvocableMethod(
        label='Dashboard State'
        description='Handles the Dashboard State use cases'
    )

    global static List<Response> performOperation(List<Request> requests) {
        System.debug('DashboardStateInvocable.performOperation');
        return new DashboardStateInvocable(requests.get(0)).doAutoInvoke();
    }

    global class Request {    
        @InvocableVariable(required=true)
        global String actionType;

        @InvocableVariable(required=true)
        global String fieldName;

        @InvocableVariable(required=true)
        global String fieldValue;
    }

    global class Response {
        @InvocableVariable
        global String actionType;

        @InvocableVariable
        global String fieldName;

        @InvocableVariable
        global String fieldValue;

    }

    private final Request request;
    public DashboardStateInvocable(Request request) {
        System.debug('DashboardStateInvocable constructor');
        this.request = request;
        if (null != this.request){
            System.debug('actionType: ' + this.request.actionType);
            System.debug('fieldName: ' + this.request.fieldName);
            System.debug('fieldValue: ' + this.request.fieldValue);
        }
    }

    public DashboardStateInvocable() {
        this(null);
        System.debug('DashboardStateInvocable default constructor');
    }

    public List<Response> doAutoInvoke() {
        System.debug('DashboardStateInvocable.doAutoInvoke');    
        if (null == this.request){
            Exception e = new NullPointerException();
            e.setMessage('Invocable request not set.');
            throw e;
        }

        String actionType = request.actionType;
        String fieldName = request.fieldName;
        String fieldValue = request.fieldValue;

        Map<String, Object> params = new Map<String, Object>();
        params.put('actionType', actionType);
        params.put('fieldName', fieldName);
        params.put('fieldValue', fieldValue);

        Response response = new Response();
        response.actionType = (String) params.get('actionType');
        response.fieldName = (String) params.get('fieldName');
        response.fieldValue = (String) params.get('fieldValue');

        List<Response> rv = new List<Response>();
        rv.add(response);
        
        return rv;

    }
}