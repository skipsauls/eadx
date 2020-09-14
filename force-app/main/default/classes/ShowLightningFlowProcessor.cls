public class ShowLightningFlowProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
    
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'Flow');
        System.debug('criteria: ' + criteria);
        if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        
        String flowName = criteria;
        
        List<Object> results = new List<Object>();
        Map<String, Object> result = new Map<String, Object>();
        
        // What to do here?
        
        result.put('criteria', criteria);
        result.put('flowName', flowName);
        
        results.add(result);
        
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
        

    }
}