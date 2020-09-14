public class CommandAction{
    public enum ResultStatus{
        SUCCESS, 
        FAIL_NOT_ENOUGH_INFO,
        FAIL_UNKNOWN_PROCESSOR,
        FAIL_UNKNOWN_COMMAND_TARGET,
        FAIL_OTHER
    }
    
    public final String type;
    
    public final ResultStatus status;
    
    public final List<Object> results;
    
    public CommandAction(ResultStatus status, String type, List<Object> results){
        this.type = type;
        this.status = status;
        this.results = results;
    }

}