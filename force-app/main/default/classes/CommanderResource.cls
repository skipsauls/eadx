@RestResource(urlMapping='/commander')
global with sharing class CommanderResource{
    private static final String COMMAND_PARAM = 'c';
    private static final String STATUS_PARAM = 'status';
    private static final String RESULT_LIMIT_PARAM = 'limit';
    private static final Integer DEFAULT_LIMIT = 10;
    private static final Integer MAX_LIMIT = 20;
    private static final Map<String, CommandAction.ResultStatus> RESULT_STATUS_CODES = 
        initializeResultStatusMap();

    static Map<String, CommandAction.ResultStatus> initializeResultStatusMap(){
        Map<String, CommandAction.ResultStatus> rv = new Map<String, CommandAction.ResultStatus>();
        for(CommandAction.ResultStatus status: CommandAction.ResultStatus.values()){
            rv.put(String.valueOf(status).toUpperCase(), status);
        }
        return rv;
    }
    
    public static CommandAction.ResultStatus getRequestedStatus(String statusString){
        return String.isBlank(statusString) ? null : RESULT_STATUS_CODES.get(statusString.toUpperCase());
    }
    
    @HttpGet
    global static void doGet(){
        RestRequest request = RestContext.request;
        RestResponse response = RestContext.response;
        try{            
            String commandPhrase = request.params.get(COMMAND_PARAM);
            if (String.isEmpty(commandPhrase)){
                response.statusCode = 406;
                response.responseBody = BLOB.valueOf('No command phrase specified.');
                return;
            }
            
            String limitParam = request.params.get(RESULT_LIMIT_PARAM);
            Integer responseLimit = null == limitParam ? DEFAULT_LIMIT : Integer.valueOf(limitParam);
            if (responseLimit < 0 || responseLimit > MAX_LIMIT){
                response.statusCode = 406;
                response.responseBody = BLOB.valueOf('Limit must be greater than 0 and less than ' + MAX_LIMIT + '.');
                return;                
            }
            
            String statusString = request.params.get(STATUS_PARAM);
            CommandAction.ResultStatus status = getRequestedStatus(statusString);
            
            //response.responseBody = Blob.valueOf(asJson(new CommandInterpreter().interpretPhrase(commandPhrase, status, responseLimit)));
        }
        catch (Exception e){
                response.statusCode = 500;
                response.responseBody = BLOB.valueOf(e.getMessage());
                return;
        }
    }
    
    private static String asJson(Object obj){
        JSONGenerator generator = JSON.createGenerator(true);
        generator.writeObject(obj);
        return generator.getAsString();
    }
 
    @AuraEnabled
    global static Map<String, Object> commander(String commandPhrase, String statusParam, String limitParam){
        Map<String, Object> response = new Map<String, Object>();
        try{
            if (String.isEmpty(commandPhrase)){
                response.put('statusCode', 406);
                response.put('message', 'No command phrase specified.');
                return response;
            }
            
            Integer responseLimit = null == limitParam ? DEFAULT_LIMIT : Integer.valueOf(limitParam);            
            if (responseLimit < 0 || responseLimit > MAX_LIMIT) {
                response.put('statusCode', 406);
                response.put('message', 'Limit must be greater than 0 and less than ' + MAX_LIMIT + '.');
                return response;               
            }
            
            String statusString = statusParam;
            CommandAction.ResultStatus status = getRequestedStatus(statusString);
/*            
            CommandResponse cr = new CommandInterpreter().interpretPhrase(commandPhrase, status, responseLimit);
            response.put('command', cr.command);
            response.put('responseLimit', cr.responseLimit);
            List<Object> commands = new List<Object>();
            Map<String, Object> command = null;
            MatchingPhrase phrase = null;
            for (Command c : cr.commands) {
                System.debug('command: ' + c);
                System.debug('command.id: ' + c.id);
                System.debug('command.name: ' + c.name);
                System.debug('command.target: ' + c.target);
                System.debug('command.rankingPhrase: ' + c.rankingPhrase);
                
                command = new Map<String, Object>();
                
                command.put('id', c.id);
                command.put('name', c.name);
                command.put('target', c.target);
                
                phrase = c.rankingPhrase;                
                Map<String, Object> rankingPhrase = new Map<String, Object>();
                
                Map<String, Object> rank = new Map<String, Object>();
                rank.put('overall', phrase.rank.overall);
                rank.put('order', phrase.rank.order);
                rank.put('matching', phrase.rank.matching);
                
                rankingPhrase.put('rank', rank);
                rankingPhrase.put('phrase', phrase.phrase);
                rankingPhrase.put('missing', phrase.missing);
                rankingPhrase.put('matching', phrase.matching);
                
                command.put('rankingPhrase', rankingPhrase);
                
                commands.add(command);
  
            }
            response.put('commands', commands);
*/            
            return response;
        }
        catch (Exception e){
                response.put('statusCode', 500);
                response.put('message', e.getMessage());
                return response;
        }
    }
   
}