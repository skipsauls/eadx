public class NLQProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
    
        // BARE BONES - Pass through to client
        
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'Me');
        System.debug('criteria: ' + criteria);
        if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }        
                
        List<Object> results = new List<Object>();
        Map<String, Object> result = new Map<String, Object>();
        
        
        result.put('criteria', criteria);
        
        results.add(result);
        
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
        

    }
}