public class ViewEditSObjectProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
        if (String.isEmpty(command.Target)){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        
        String criteria = getPhraseAfterKeyword(requestedPhrase, command.Target);
        if (null == criteria){
            return new CommandAction(CommandAction.ResultStatus.FAIL_NOT_ENOUGH_INFO, actionType, null);
        }
        System.Debug('Criteria: ' + criteria);        
        String soql = 'SELECT Id, Name '+
                    'FROM '+ command.Target + ' ' +
                    'WHERE Name LIKE \'%' + criteria + '%\' ' +
                    'ORDER BY LastViewedDate DESC ' + 
                    'LIMIT ' + resultLimit;
        System.Debug(soql);
        List<SObject> soqlResults = Database.query(soql);
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, soqlResults);
    }
}