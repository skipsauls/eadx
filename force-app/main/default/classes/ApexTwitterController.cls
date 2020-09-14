@RestResource(urlMapping='/apextwitter/*') 
global with sharing class ApexTwitterController {

    @AuraEnabled
    global static String getAppRateLimit(String resources) {
        return ApexTwitterUtils.getAppRateLimit(resources);
    }
    
    @AuraEnabled
    global static String fireEvent(String type, String target, String payload) {

        EinsteinAnalyticsEvent__e event = new EinsteinAnalyticsEvent__e();
        event.type__c = type;
        event.target__c = target;
        event.payload__c = payload;
        
        EventBus.publish(event);
        
        String ret = 'foo';
        return ret;
    }
    
    @HttpGet            
    global static String test() {
        Boolean refresh = RestContext.request.params.get('refresh') == 'true';

        String accessToken = ApexTwitterUtils.getBearerToken(refresh);
        return accessToken;
    }
    
    @HttpPut            
    global static String authorize() {  
        return 'foo';             
    }
    
    global static List<Map<String,Object>> transformTweetsForApexStep(Map<String, Object> tweets) {

        List<Map<String,Object>> xtweets = new List<Map<String,Object>>();
        Map<String,Object> xtweet = null;
        List<Object> statuses = (List<Object>) tweets.get('statuses');
        Map<String,Object> status = null;
        List<Object> hashtagList = null;
        List<Object> allHashtagsList = null;
        Map<String,Object> hashtag = null;
        String hashtags = null;
        List<Object> userMentionList = null;
        Map<String,Object> userMention = null;
        String userMentionIds = null;
        String userMentionNames = null;
        String userMentionScreenNames = null;
        Map<String,Object> entities = null;
        Map<String,Object> user = null;
        String delim = null;
        Long timestamp = -1;
        
        Map<String, List<Object>> hashtagMap = new Map<String, List<Object>>();
        //List<Object> hashtagList = null;
        Object hashtagObj = null;
        String hashtagText = null;
        if (statuses != null) {
        
            // Sort by hashtags
            for (Object s : statuses) {
                status = (Map<String,Object>) s;
                
                //System.debug('))))))))))))))))))))))))))))))))))        status: ' + status);
                
                user = (Map<String,Object>) status.get('user');
                
                entities = (Map<String,Object>) status.get('entities');
                
                hashtagList = (List<Object>) entities.get('hashtags');
                hashtags = '';
                delim = '';
                for (Object h: hashtagList) {
                    hashtag = (Map<String,Object>) h;
                    hashtagText = (String) hashtag.get('text');
                    
                    hashtagList = (List<Object>) hashtagMap.get(hashtagText);
                    if (hashtagList == null) {
                        hashtagList = new List<Object>();
                        hashtagList.add(status);
                        hashtagMap.put(hashtagText, hashtagList);
                    }
                }
            }
            
            for (String hashtagKey: hashtagMap.keySet()) {
                hashtagList = (List<Object>) hashtagMap.get(hashtagKey);
                for (Object s: hashtagList) {
                    status = (Map<String,Object>) s;
    
                    user = (Map<String,Object>) status.get('user');
                    
                    entities = (Map<String,Object>) status.get('entities');


                    allHashtagsList = (List<Object>) entities.get('hashtags');
                    hashtags = '';
                    delim = '';
                    for (Object h: allHashtagsList) {
                        hashtag = (Map<String,Object>) h;
                        hashtags += delim + hashtag.get('text');
                        delim = ',';
                    }
                    
                    userMentionList = (List<Object>) entities.get('user_mentions');
                    userMentionIds = '';
                    userMentionNames = '';
                    userMentionScreenNames = '';
                    delim = '';
                    for (Object u: userMentionList) {
                        userMention = (Map<String,Object>) u;
                        userMentionIds += delim + userMention.get('id_str');
                        userMentionNames += delim + userMention.get('name');
                        userMentionScreenNames += delim + userMention.get('screen_name');
                        delim = ',';
                    }
                    
                    timestamp = -1;            
                    
                    //   Thu Oct 26 18:16:32 +0000 2017
                    
                    try {                
                        String c = (String) status.get('created_at');
                        List<String> ct = c.split(' ');
                        String m = '' + ApexTwitterUtils.MonthMap.get(ct[1]);
                        String d = ct[2];
                        String t = ct[3];
                        String y = ct[5];
                        
                        List<String> tt = t.split(':');
                        String hh = tt[0];
                        String mm = tt[1];
                        String ss = tt[2];
                        
                        String meridiem = 'AM';
                        
                        Integer hhi = Integer.valueOf(hh);
                        if (hhi > 12) {
                            meridiem = 'PM';
                            hhi -= 12;
                        }
                        
                        String t2 = hhi + ':' + mm + ' ' + meridiem;
                        
                        String c2 = m + '/' + d + '/' + y + ' ' + t2; //   10/14/2011 11:46 AM
                        DateTime dt = DateTime.parse(c2);                
                        timestamp = dt.getTime();
                                        
                    } catch (Exception e) {
                        System.debug('date exception: ' + e);
                    }
                    
                    xtweet = new Map<String,Object>();
                    xtweet.put('Created', timestamp);
                    xtweet.put('Text', status.get('text'));
                    xtweet.put('Id', status.get('id_str'));
                    xtweet.put('User Name', user.get('name'));
                    xtweet.put('Screen Name', user.get('screen_name'));
                    xtweet.put('User Id', user.get('id'));
                    xtweet.put('Unique Hashtag', hashtagKey);
                    xtweet.put('Hashtags', hashtags);
                    xtweet.put('User Mention Ids', userMentionIds);
                    xtweet.put('User Mention Names', userMentionNames);
                    xtweet.put('User Mention Screen Names', userMentionScreenNames);
                    xtweet.put('Retweets', status.get('retweet_count'));
                    xtweet.put('Favorites', status.get('favorite_count'));
                    
                    // Score is Retweets + Favorites (maybe needs weighting?)
                    Integer score = Integer.valueOf( status.get('retweet_count')) + Integer.valueOf(status.get('retweet_count'));
                    xtweet.put('Score', score);
                    
                    xtweets.add(xtweet);
                        
                    
                    
                }
            }
        }      
        
        return xtweets;
    }
    
    global static List<Map<String,Object>> searchTweets(String type, String transform, Integer count, String result_type, String hashtags, String usernames) {
        //System.debug('************************* ------------------------------------------------------> query: ' + query);
        //System.debug('************************* ------------------------------------------------------> transform: ' + transform);
        //System.debug('************************* ------------------------------------------------------> hashtags: ' + hashtags);
        //System.debug('************************* ------------------------------------------------------> usernames: ' + usernames);
    
        String accessToken = ApexTwitterUtils.getBearerToken(false);
        
        //System.debug('accessToken: ' + accessToken);
        
        String q = 'count=' + count + '&result_type=' + result_type + '&q=';
        
        String delim = '';
      
        // FOR DEMO ALWAYS INCLUDE #TDX20
        
        if (hashtags != null && hashtags.length() > 0) {
            List<String> tags = hashtags.split(',');
            delim = ',';
            for (String tag: tags) {
                q += delim + tag.replace('#', '%23');
            }
        } else {
            q += '%23TDX20';
        }
        
        // If type is not query, do not include the usernames
        if (type != 'top_usernames' && type != 'top_hashtags') {
            if (usernames != null && usernames.length() > 0) {
                q += '%20' + usernames; 
            }
        }
        
        //System.debug('                                             q: ' + q);
        
        String url = 'https://api.twitter.com/1.1/search/tweets.json';

        //String encQuery = EncodingUtil.urlEncode(q, 'UTF-8');

        //System.debug('------------------------------------------------------> encQuery: ' + encQuery);
        
        
        url += '?' + q; //encQuery;
        
        //System.debug('------------------------------------------------------> url: ' + url);
                        
        HttpRequest request = new HttpRequest();        
        Http http = new Http();
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('Content-type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + accessToken);
        
        HTTPResponse response = http.send(request);

        String body = response.getBody();                    

        //System.debug('------------------------------------------------------> body: ' + body);

        Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(body);

        if (transform == 'apex_step') {
            List<Map<String,Object>> xtweets = transformTweetsForApexStep(m);
            return xtweets;
        } else {
            return null;
        }
 
    }
        
    @HttpPost            
    global static String callTwitter(String type, String transform, Integer count, String result_type, String hashtags, String usernames, List<String> strings, List<String> numbers, List<String> groupings, String dummy) {
    
        List<Map<String,Object>> tweets = searchTweets(type, transform, count, result_type, hashtags,  usernames);

        if (strings == null) {
            strings = new List<String>();
            if (type == 'top_usernames') {
                strings.add('Screen Name');            
            } else if (type == 'top_hashtags') {
                strings.add('Unique Hashtag');            
            } else {
                strings.add('Text');
                strings.add('User Name');
                strings.add('Screen Name');
                strings.add('Hashtags');
                strings.add('Unique Hashtag');
            }
        }
        
        if (numbers == null) {
            numbers = new List<String>();
            //numbers.add('Created');
            
            if (type == 'top_usernames') {
                numbers.add('Score');
                //numbers.add('Retweets');
                //numbers.add('Favorites');
            } else if (type == 'top_hashtags') {
                numbers.add('Score');
            } else {            
                numbers.add('Retweets');
                numbers.add('Favorites');
            }
        }
        
        if (groupings == null) {
            groupings = new List<String>();
            if (type == 'top_usernames') {
                groupings.add('User Name');
                groupings.add('Unique Hashtag');
            } else if (type == 'top_hashtags') {
                groupings.add('Unique Hashtag');
            } else {            
                groupings.add('Unique Hashtag');
            }
        }
        
        ReturnMetadata rm = new ReturnMetadata(strings, numbers, groupings);
            
        String body = JSON.serialize(new PackagedReturnItem(tweets, rm));
        
        return body;
        
        //RestContext.response.addHeader('Content-Type', 'application/json');
        //RestContext.response.responseBody = Blob.valueOf(body);        
        
    } 
    
    // Get the records from the query response 
    private static List<Object> getQueryRecords(Map<String, Object> resultMap) { 
        List<Object> records = (List<Object>)resultMap.get('records'); 
        return records; 
    } 
    
    // Get the metadata from the query response 
    private static void getQueryMetadata(List<String> strings, List<String> numbers, List<Object> groupings, Map<String, Object> resultMap) { 
    
        Map<String, Object> metadataMap = (Map<String, Object>)resultMap.get('metadata'); 
        List<Object> columns = (List<Object>)metadataMap.get('columns'); 
    
        for(Integer i = 0 ; i < columns.size(); i++) { 
            Map<String, Object> curColumn = (Map<String, Object>) columns[i]; 
            if(curColumn.get('type') == 'Numeric') { 
                numbers.add((String)curColumn.get('name')); 
            } else { 
                strings.add((String)curColumn.get('name')); 
            } 
        } 
        groupings = (List<Object>) metadataMap.get('groups'); 
    } 
    
    private class ReturnMetadata { 
    
        public final List<String> strings; 
        public final List<String> numbers; 
        public final List<Object> groupings; 
        
        public ReturnMetadata(List<String> strings, List<String> numbers, List<Object> groupings) { 
            this.strings = strings; 
            this.numbers = numbers; 
            this.groupings = groupings; 
        } 
    } 
    
    private class PackagedReturnItem { 
    
        public final List<Object> data; 
        public final ReturnMetadata metadata; 
        
        public PackagedReturnItem(List<Object> data, ReturnMetadata metadata) { 
            this.data = data; 
            this.metadata = metadata; 
        } 
    }    
    
    
}