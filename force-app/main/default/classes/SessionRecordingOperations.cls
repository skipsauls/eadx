global class SessionRecordingOperations {
    global enum Operation{
        OP_START, 
        OP_STOP, 
        OP_DELETE
    }
        
    static Map<String, Operation> initializeOpMap(){
        Map<String, Operation> rv = new Map<String, Operation>();
        for(Operation status: Operation.values()){
            rv.put(String.valueOf(status).toUpperCase(), status);
        }
        return rv;
    }

    private static final Map<String, Operation> OP_CODES =
        initializeOpMap();

    global static Operation resolveOperation(String operationString){
        return String.isBlank(operationString) ? null : OP_CODES.get(operationString.toUpperCase());
    }
}