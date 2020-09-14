public class SelectAnalyticsDashboardPageProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
    
        String criteria = getPhraseAfterKeyword(requestedPhrase, 'To');
        System.debug('criteria: ' + criteria);
        if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }        
        
        String phrase = criteria.toLowerCase();
        
        String pageName = phrase.trim();
        
        System.debug('pageName: ' + pageName);
        
        List<Object> results = new List<Object>();
        Map<String, Object> result = new Map<String, Object>();
        
        
        result.put('criteria', criteria);
        result.put('pageName', pageName);
        
        results.add(result);
        
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
        

    }
}