global with sharing class SessionRecordingInvocable {

    @AuraEnabled
    global static List<CommanderSession__c> getSessionData(String nameSearch){
        String userId = UserInfo.getUserId();
        if (null == nameSearch){
            return [SELECT Id, Name, inSession__c from CommanderSession__c 
                    WHERE CreatedById = :userId AND inSession__c = false];
        } else {
            String likeExpr = '%' + nameSearch.trim() + '%';
            return [SELECT Id, Name, inSession__c from CommanderSession__c 
                    WHERE Name LIKE :likeExpr 
                        AND CreatedById = :userId
                        AND inSession__c = false];
        }
    }

    @AuraEnabled
    global static CommanderSession__c createSessionData(String sessionName, Boolean inSession){
        CommanderSession__c rv = new CommanderSession__c();
        rv.Name = sessionName;
        rv.inSession__c = inSession;
        insert rv;
        return rv;
    }

    @AuraEnabled
    global static CommanderSession__c updateSessionData(String sessionId, String sessionName){
        String userId = UserInfo.getUserId();
        CommanderSession__c rv = [SELECT Id, Name FROM CommanderSession__c 
                                  WHERE Id = :sessionId  
                                 	AND CreatedById = :userId];
        rv.Name = sessionName;
        return rv;
    }

    @AuraEnabled
    global static void deleteSessionData(String sessionId){
        String userId = UserInfo.getUserId();
        CommanderSession__c rv = [SELECT Id, Name FROM CommanderSession__c 
                                  WHERE Id = :sessionId  
                                 	AND CreatedById = :userId];
        delete rv;
    }
    
    @AuraEnabled
    global static List<CommanderSession__c> getRecordedSessionTreeData(){
        String userId = UserInfo.getUserId();
        return [SELECT Id, Name,(SELECT Id,Phrase__c FROM SessionCommands__r ORDER BY Name) 
            FROM CommanderSession__c 
            WHERE CreatedById = :userId AND
               inSession__c = FALSE];
    }

    @AuraEnabled
    global static List<SessionCommand__c> getSessionCommandData(String sessionId){
        return [SELECT Id, Phrase__c 
            FROM SessionCommand__c 
            WHERE CommanderSession__c = :sessionId
            ORDER BY Name ASC];
    }

    @AuraEnabled
    global static SessionCommand__c createSessionCommand(String sessionId, String phrase){
        System.debug('SessionRecordingInvocable.createSessionCommand() called with sessionId \'' + 
            sessionId + '\' and phrase \'' + phrase + '\'.');

        CommanderSession__c[] sessions = [SELECT Id, inSession__c, CreatedById FROM CommanderSession__c WHERE Id = :sessionId];
        if (sessions.size() == 0){
            NoDataFoundException e = new NoDataFoundException();
            e.setMessage('Unknown recorded session.');
            throw e;
        }
        CommanderSession__c session = sessions[0];
        if (session.CreatedById != UserInfo.getUserId()){
            SObjectException e = new SObjectException();
            e.setMessage('Not session owner.');
            throw e;
        }
        SessionCommand__c command = new SessionCommand__c();
        command.CommanderSession__c = sessionId;
        command.Phrase__c = phrase;
        insert command;
        return command;
    }

    @AuraEnabled
    global static SessionCommand__c updateSessionCommand(String commandId, String phrase){
        System.debug('SessionRecordingInvocable.updateSessionCommand() called with commandId \'' + 
            commandId + '\' and phrase \'' + phrase + '\'.');
        SessionCommand__c command = [SELECT Id, CommanderSession__r.inSession__c, CreatedById FROM SessionCommand__c WHERE Id = :commandId];
        if (null == command){
            NoDataFoundException e = new NoDataFoundException();
            e.setMessage('Unknown command.');
            throw e;
        }
        if (command.CommanderSession__r.inSession__c){
            SObjectException e = new SObjectException();
            e.setMessage('Session is recording.');
            throw e;
        }
        if (command.CreatedById != UserInfo.getUserId()){
            SObjectException e = new SObjectException();
            e.setMessage('Not session owner.');
            throw e;
        }
        command.phrase__c = phrase;
        update command;
        return command;
    }

    @AuraEnabled
    global static void deleteSessionCommand(String commandId){
        System.debug('SessionRecordingInvocable.deleteSessionCommand() called with commandId \'' + 
            commandId + '\'.');
        SessionCommand__c command = [SELECT Id, CreatedById FROM SessionCommand__c WHERE Id = :commandId];
        if (null == command){
            NoDataFoundException e = new NoDataFoundException();
            e.setMessage('Unknown command.');
            throw e;
        }
        if (command.CreatedById != UserInfo.getUserId()){
            SObjectException e = new SObjectException();
            e.setMessage('Not session owner.');
            throw e;
        }
        delete command;
    }
    
    @InvocableMethod(
        label='Manage Recording Sessions' 
        description='Manages (starts and stops) commander recording sessions.'
    )
    global static List<Response> performOperation(List<Request> requests){
        Request request = requests.get(0);
        SessionRecordingOperations.Operation operation = 
            SessionRecordingOperations.resolveOperation(request.operation);
        if (null == operation){
            Exception e = new NoDataFoundException();
            e.setMessage('Unknown operation: ' + request.operation);
            throw e;           
        } 
        CommanderSession__c session = null;
        String userId = UserInfo.getUserId();
        System.debug('SessionRecordingInvocable.performOperation() called with operation \'' + 
            operation.name() + '\' and sessionName \'' + request.sessionName + '\'.');
        switch on operation {
            when OP_START {
                if (null == request.sessionName){
                    Exception e = new NoDataFoundException();
                    e.setMessage('Session name is required');
                    throw e;           
                } 
                CommanderSession__c[] existingSessions = [SELECT Name from CommanderSession__c 
                     WHERE inSession__c = true AND CreatedById = :userId];
                if (existingSessions.size() > 0){
                    Exception e = new LimitException();
                    e.setMessage('Only One recording can be in session, currently : ' + existingSessions[0].Name +' owns the session');
                    throw e; 
                }
                // Now, let's see if any exist by name.  If so, resume.
                existingSessions = [SELECT Id, Name, inSession__c from CommanderSession__c 
                    WHERE Name = :request.sessionName AND CreatedById = :userId];
                Boolean exists = existingSessions.size() > 0;
                if (exists){
                    session = existingSessions[0];
                    session.inSession__c = true;
                    Update session;                    
                } else {
                    session = New CommanderSession__c();
                    session.Name = request.sessionName;
                    session.inSession__c = true;
                    Insert session;
                }
            }   
            when OP_STOP{
               CommanderSession__c[] sessions = [SELECT Id, Name from CommanderSession__c where 
                   inSession__c = true AND CreatedById = :userId LIMIT 1];
               if (sessions.size() > 0){
                   session = sessions[0];
                   session.inSession__c = false;
                   update session;
               }
            }
            when OP_DELETE {
               if (null == request.sessionName){
                    Exception e = new NoDataFoundException();
                    e.setMessage('Session name is required');
                    throw e;           
               } 
               String likeExpr = '%' + request.sessionName.trim() + '%';
               CommanderSession__c[] sessions = [SELECT Id, Name from CommanderSession__c where Name LIKE :likeExpr AND CreatedById = :userId];
               if (sessions.size() > 0){
                   session = sessions[0];
                   delete session;
               }
            }
        }
        List<Response> rv = new List<Response>();
        if (null != session){
            Response response = new Response();
            response.operation = operation.name();
            response.session = session;
            rv.add(response);
        }
        return rv;
    }
        
    global class Request{    
        @InvocableVariable(required=true)
        global String operation;

        @InvocableVariable()
        global String sessionName;
        
    }
    
    global class Response{
        @InvocableVariable
        global String operation;
        
        @InvocableVariable
        global CommanderSession__c session;
    }
    
}