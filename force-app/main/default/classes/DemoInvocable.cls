global with sharing class DemoInvocable{
    
    @InvocableMethod(
        label='Demo' 
        description='Demo Invocable'
    )
    global static List<Response> performOperation(List<Request> requests){
        return new DemoInvocable(requests.get(0)).doAutoInvoke();
    }
            
    global class Request{    
        @InvocableVariable(required=false)
        global String accountName;
    }
    
    global class Response{
        @InvocableVariable
        global String result;
        @InvocableVariable
        global String speech;
        @InvocableVariable
        global String text;
    }
    
    private final Request request;
    public DemoInvocable(Request request){
        this.request = request;
        if (null != this.request){
            String msg = 'Account Name: ' + this.request.accountName;
            System.debug(msg);
        }
    }

    public DemoInvocable(){
        this(null);
    }
    
    public List<Response> doAutoInvoke(){
        if (null == this.request){
            Exception e = new NullPointerException();
            e.setMessage('Invocable request not set.');
            throw e;
        }

        String account = request.accountName;
/*
        String url = 'https://clause.ngrok.io';
        
        HttpRequest req = new HttpRequest();        
        Http http = new Http();
        req.setEndpoint(url);
        req.setMethod('GET');
        //req.setHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        //req.setHeader('Authorization', 'Basic ' + auth);
        //req.setBody('grant_type=client_credentials');
        
        HTTPResponse res = http.send(req);
        
        String body = res.getBody();
        System.debug('ping body: ' + body);
        
  */
        String body = 'PM is cool';
        
        Response response = new Response();
        response.result = body;
        response.text = body;
        response.speech = body;

        List<Response> rv = new List<Response>();
        rv.add(response);
        
        return rv;

    }
    
}