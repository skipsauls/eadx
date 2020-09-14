public class UnknownActionProcessor
extends ActionProcessor{
    public override CommandAction getCommandAction(String requestedPhrase, String actionType, Command command, Integer resultLimit){
        return new CommandAction(CommandAction.ResultStatus.FAIL_UNKNOWN_PROCESSOR, actionType, null);
    }
}