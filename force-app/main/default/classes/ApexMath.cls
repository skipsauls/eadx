@RestResource(urlMapping='/apexmath/*') 
global class ApexMath {

    global static List<Object> calc(Double d, Integer exp, Integer count) {
    
        List<Object> results = new List<Object>();
        
        Datetime t1 = Datetime.now();

        List<Double> p = new List<Double>();
        for (Integer i = 0; i < count; i++) {
            p.add(Math.pow(d, i));
        }

        Datetime t2 = Datetime.now();
        Long timing = t2.getTime() - t1.getTime();
        
        results.add('count: ' + count);
        results.add('time: ' + timing + ' ms');
        results.add('' + (count / timing * 1000) + ' per second');
        results.add(p.get(0));

        return results;
    }

    @HttpPost            
    global static void test(Double d, Integer exp, Integer count) {

        List<Object> results = calc(d, exp, count);
            
        String body = JSON.serialize(results);
        
        RestContext.response.addHeader('Content-Type', 'application/json');
        RestContext.response.responseBody = Blob.valueOf(body);
    }

    @AuraEnabled
    global static List<Object> doCalc(Double d, Integer exp, Integer count) {
        return calc(d, exp, count);
    }


    global static List<Object> strMatch(String target, String match, Integer count) {
    
        List<Object> results = new List<Object>();
        
        Datetime t1 = Datetime.now();

        List<Double> p = new List<Double>();
        for (Integer i = 0; i < count; i++) {
            p.add(target.indexOf(match));
        }

        Datetime t2 = Datetime.now();
        Long timing = t2.getTime() - t1.getTime();
        
        results.add('count: ' + count);
        results.add('time: ' + timing + ' ms');
        results.add('' + (count / timing * 1000) + ' per second');
        results.add(p.get(0));

        return results;
        /*        
        Map<String, Object> res = new Map<String, Object>();
        res.put('result', 1234);
        res.put('timing', timing);
        */
    }


    @AuraEnabled
    global static List<Object> doStr(String target, String match, Integer count) {
        return strMatch(target, match, count);
    }


}