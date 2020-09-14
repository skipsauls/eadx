public class CommandReferenceResponse{
    public final Integer minIndex{get;set;}
    public final Integer maxIndex{get;set;}
    public final String requestedHint{get;set;}
    public final Map<Integer, Set<String>> segments{get;set;}
    
    public CommandReferenceResponse(Integer minIndex, Integer maxIndex, Map<Integer, Set<String>> segments, String requestedHint){
        this.minIndex = minIndex;
        this.maxIndex = maxIndex;
        this.segments = segments;
        this.requestedHint = requestedHint;
    }
}