global with sharing class ManageCalculatorAirInvocable{
    private static final String templateApiName = 'Mortgage_Calculator';
    
    @InvocableMethod(
        label='Manage Mortgage Calculator' 
        description='Manages (creates, updates, deletes) mortgage calculator app.'
    )
    global static List<GenericAirInvocable.Response> performOperation(List<Request> requests){
        Request request = requests.get(0);
        AutoInstallOperations.Operation operation = 
            AutoInstallOperations.resolveOperation(request.operation);
        if (null == operation){
            Exception e = new NoDataFoundException();
            e.setMessage('Unknown operation: ' + request.operation);
            throw e;           
        }
        GenericAirInvocable invocable = new GenericAirInvocable();
        switch on operation {
            when OP_CREATE {
                return invocable.doCreate(templateApiName, request.appLabel, 
                    getConfiguration(request.appLabel, request.amount, request.percentage, request.years));
            }   
            when OP_CREATE_OR_UPDATE{
                    return invocable.doCreateOrUpdate(templateApiName, 
                        request.appLabel, getConfiguration(request.appLabel, 
                            request.amount, request.percentage, request.years));
            }
            when OP_UPDATE {
                return invocable.doUpdate(templateApiName, request.appLabel, 
                    getConfiguration(request.appLabel, request.amount, request.percentage, request.years));
            }
            when OP_DELETE {
                return invocable.doDelete(templateApiName, request.appLabel);
            }
        }
        return new List<GenericAirInvocable.Response>();
    }
        
    global class Request{    
        @InvocableVariable(required=true)
        global String operation;
        
        @InvocableVariable()
        global Double amount;
        
        @InvocableVariable()
        global Double percentage;

        @InvocableVariable()
        global Integer years;

        @InvocableVariable()
        global String appLabel;
        
    }
    
    private static Map<String, Object> getConfiguration(String label, Double amount, Double percentage, Integer years){
        Map<String, Object> configuration = new Map<String, Object>();
        Map<String, Object> values = new Map<String, Object>();
        if (null != amount){
            values.put('FinancingAmount', amount);
        }
        if (null != percentage){
            values.put('AnnualPercentageRate', percentage);
        }
        if (null != years){
            values.put('LoanTermYears', years);
        }
        if (null != label){
            values.put('AppLabel', label);
        }
        Map<String, Object> appConfiguration = new Map<String,Object>();
        appConfiguration.put('deleteAppOnConstructionFailure', true);
        appConfiguration.put('values', values);
        configuration.put('appConfiguration', appConfiguration);
        return configuration;
    }
    
}