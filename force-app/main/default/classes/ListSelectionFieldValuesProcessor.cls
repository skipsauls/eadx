public class ListSelectionFieldValuesProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
    
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'List');
        System.debug('criteria: ' + criteria);
        if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        
        String fieldName = criteria.replace('values', '');
        fieldName = fieldName.trim();
        
        List<Object> results = new List<Object>();
        Map<String, Object> result = new Map<String, Object>();
        
        result.put('criteria', criteria);
        result.put('fieldName', fieldName);
        result.put('isFilter', false);
        
        results.add(result);
                
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
    }
}