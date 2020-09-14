@RestResource(urlMapping='/stockea')
global with sharing class stock {

    @HttpPost   
    global static String stockea(String symbol, String frequency, String fromDate, String toDate, String order) {
        // default to CRM stock
        if (symbol == null) {
            symbol = 'CRM';
        }
        if (frequency == null) {
            frequency = 'Weekly';
        }
            if (fromDate == null) {
            fromDate = '2019-01-01';
        }
                                if (toDate == null) {
            toDate = '2019-12-05';
        }
        
                                if (order == null) {
            order = 'asc';
        }

        // fetch some stock data
        HttpRequest request = new HttpRequest();
        Http http = new Http();
        // make sure this domain is whitelisted in the proxy
        String st2;
        st2 = 'https://eastockdemo.herokuapp.com/stock/'+symbol+'/'+frequency+'/'+fromDate+'/'+toDate+'/'+order+'';
        request.setEndpoint('https://eastockdemo.herokuapp.com/stock/'+symbol+'/'+frequency+'/'+fromDate+'/'+toDate+'/'+order+'');
        // http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A30%2C%22DataPeriod%22%3A%22Week%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22CRM%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');
		request.setHeader('Accept','application/json');
        System.debug(st2);
        try {
            HTTPResponse response = http.send(request);
            JSONParser parser = JSON.createParser(response.getBody());
            List<Map<String, Object>> returnItems = new List<Map<String, Object>>();
            while (parser.nextToken() != null) {
                // find the stock part of the response
                system.debug('outer');

                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                    // parse the stock response and form the response for this controller
                    
                    parser.nextToken();
                    parser.nextToken();

                    system.debug('inner');
                    Map<String, Object> curRow = new Map<String, Object>();
                    
                    curRow.put('date', parser.getText());
                    
                    parser.nextToken();
                    parser.nextToken();
                    
                    curRow.put('value',Decimal.valueof(parser.getText()));

                    returnItems.add(curRow);
                    
                    
                    
                }
            }
    	//String st = JSON.serialize(new ApexStepResponse(returnItems));
        //    System.debug(st);
    	return JSON.serialize(new ApexStepResponse(returnItems));
    	//return st;
        } catch(Exception exp) {
            System.debug('exception '+exp);
        }
        
        return '';
    }

    
    
}