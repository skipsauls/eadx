public class ListSelectionFieldsProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
    
        // This will be handled client-side for now
        
        List<Object> results = new List<Object>();
        Map<String, Object> result = new Map<String, Object>();
        return new CommandAction(CommandAction.ResultStatus.SUCCESS, actionType, results);
    }
}