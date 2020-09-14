@RestResource(urlMapping='/commander/reference')
global with sharing class CommanderReferenceResource{
    private static final String MIN_INDEX_PARAM = 'minIndex';
    private static final String MAX_INDEX_PARAM = 'maxIndex';
    private static final String HINT_PARAM = 'hint';
    private static final Integer DEFAULT_MIN_INDEX = 0;
    private static final Integer DEFAULT_MAX_INDEX = 9;

    @HttpGet
    global static void doGet(){
        RestRequest request = RestContext.request;
        RestResponse response = RestContext.response;
        try{            
            String minIndexParam = request.params.get(MIN_INDEX_PARAM);
            Integer minIndex = null == minIndexParam ? DEFAULT_MIN_INDEX : Integer.valueOf(minIndexParam);
            if (minIndex < 0){
                response.statusCode = 406;
                response.responseBody = BLOB.valueOf('Invalid minimum index.');
                return;                
            }

            String maxIndexParam = request.params.get(MAX_INDEX_PARAM);
            Integer maxIndex = null == maxIndexParam ? DEFAULT_MAX_INDEX : Integer.valueOf(maxIndexParam);
            if (maxIndex < minIndex){
                response.statusCode = 406;
                response.responseBody = BLOB.valueOf('Max index must be greater than min index.');
                return;                
            }            
            String requestedHint = String.isBlank(request.params.get(HINT_PARAM)) ? null : request.params.get(HINT_PARAM);
            /*
            response.responseBody = Blob.valueOf(
                asJson(new CommandInterpreter().getCommandReference(minIndex, maxIndex, requestedHint)));
                */
        }
        catch (Exception e){
                response.statusCode = 500;
                response.responseBody = BLOB.valueOf(e.getMessage());
                return;
        }
    }
    
    private static String asJson(Object obj){
        JSONGenerator generator = JSON.createGenerator(true);
        generator.writeObject(obj);
        return generator.getAsString();
    }
    
    
    @AuraEnabled
    global static Map<String, Object> commander(String hintParam, String min, String max){
        Map<String, Object> response = new Map<String, Object>();
                
        try{            
            Integer minIndex = null == min ? DEFAULT_MIN_INDEX : Integer.valueOf(min);
            if (minIndex < 0){
                response.put('statusCode', 406);
                response.put('message', 'Invalid minimum index.');
                return response;                
            }

            Integer maxIndex = null == max ? DEFAULT_MAX_INDEX : Integer.valueOf(max);
            if (maxIndex < minIndex){
                response.put('statusCode', 406);
                response.put('message', 'Max index must be greater than min index.');
                return response;                
            }            
            System.debug('hintParam: (' + hintParam + ')');
            String requestedHint = String.isBlank(hintParam) ? null : hintParam;
            System.debug('requestedHint: (' + requestedHint + ')');
            /*
            CommandReferenceResponse cr = new CommandInterpreter().getCommandReference(minIndex, maxIndex, requestedHint);
            
            response.put('requestedHint', cr.requestedHint);
            response.put('minIndex', cr.minIndex);
            response.put('maxndex', cr.maxIndex);
            response.put('segments', cr.segments);
*/
            return response;
            
        }
        catch (Exception e){
                response.put('statusCode', 500);
                response.put('message', e.getMessage());
                return response;
        }
    }    
}