({
    handleControllerResults: function(actionResults, successHandler, failureHandler){
        var results;
        if (actionResults.getState() === 'SUCCESS') {
            results = actionResults.getReturnValue();
            if (successHandler){
                successHandler(results);
            }
        } else {
            if (failureHandler){
                failureHandler(actionResults.getError()[0].message);
            }
        }        
    },
	createSession : function(cmp, event) {
        var params = event.getParam('arguments');
        var sessionName = params.sessionName;
        var inSession = params.inSession;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.createSessionData');
        apiController.setParams({
            'sessionName': sessionName,
            'inSession': inSession
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		
	},
	updateSession : function(cmp, event) {
        var params = event.getParam('arguments');
        var id = params.id;
        var sessionName = params.sessionName;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.updateSessionData');
        apiController.setParams({
            'sessionId' : id,
            'sessionName': sessionName
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		
	},
	deleteSession : function(cmp, event) {
        var params = event.getParam('arguments');
        var id = params.id;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.deleteSessionData');
        apiController.setParams({
            'sessionId' : id
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		
	},
	getSessions : function(cmp, event) {
        var params = event.getParam('arguments');
        var name = params.name;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.getSessionData');
        apiController.setParams({
            'nameSearch': name
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		
	},
    getRecordedSessionTree: function(cmp, event){
        var params = event.getParam('arguments');
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.getRecordedSessionTreeData');
        apiController.setParams({});
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		        
    },
    getSessionPhrases: function(cmp, event){
        var params = event.getParam('arguments');
        var sessionId = params.sessionId;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.getSessionCommandData');
        apiController.setParams({
            'sessionId': sessionId
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		
    },
    createPhrase: function(cmp, event){
        var params = event.getParam('arguments');
        var sessionId = params.sessionId;
        var phrase = params.phrase;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.createSessionCommand');
        apiController.setParams({
            'sessionId': sessionId,
            'phrase': phrase
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		                
    },
    updatePhrase: function(cmp, event){
        var params = event.getParam('arguments');
        var commandId = params.id;
        var phrase = params.phrase;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.updateSessionCommand');
        apiController.setParams({
            'commandId': commandId,
            'phrase': phrase
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		                
    },
    deletePhrase: function(cmp, event){
        var params = event.getParam('arguments');
        var commandId = params.id;
        var onSuccess = $A.getCallback(params.onSuccess);
        var onFailure = $A.getCallback(params.onFailure);
        var helper = this;
        var apiController = cmp.get('c.deleteSessionCommand');
        apiController.setParams({
            'commandId': commandId
        });
        apiController.setCallback(cmp, function(action){
            helper.handleControllerResults(action, onSuccess, onFailure);
        });
        $A.enqueueAction(apiController);		        
    }
})