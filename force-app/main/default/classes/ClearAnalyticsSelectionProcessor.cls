public class ClearAnalyticsSelectionProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
    
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'Clear');
        System.debug('criteria: ' + criteria);
        if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        
        
        String phrase = criteria.toLowerCase();
        
        String fieldName = phrase.substringBefore('by').trim();
        String fieldValue = phrase.substringAfter('by').trim();
        
        System.debug('fieldName: ' + fieldName);
        System.debug('fieldValue: ' + fieldValue);
        
        List<String> tokens = criteria.split(' ');
        
        for (String token: tokens) {
            System.debug('token: ' + token);
        }
        
        List<Object> results = new List<Object>();
        Map<String, Object> result = new Map<String, Object>();
        
        // What to do here?
        // Return the field name as the id and the field value as the name?
        
        result.put('criteria', criteria);
        result.put('fieldName', fieldName);
        result.put('fieldValue', fieldValue);
        
        results.add(result);
        
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
        

    }
}