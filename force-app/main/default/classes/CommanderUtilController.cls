global class CommanderUtilController {
	@AuraEnabled
    global static List<Object> listCommandActions() {
        return [SELECT Id,ActionType,Description,DeveloperName,Language,MasterLabel,NamespacePrefix,TargetId,CreatedById,CreatedDate,LastModifiedById,LastModifiedDate FROM CommandAction];
    }
    
    @AuraEnabled
    global static List<Object> listCommandActionIntents() {
        return [SELECT Id,IntentPhrase,CreatedById,CreatedDate,LastModifiedById,LastModifiedDate FROM CommandActionIntent];
    }
    
    @AuraEnabled
    global static List<Object> listCommandActionParams() {
        return [SELECT Id,CommandActionId,DefaultValue,Description,ParamName,Required,Type,CreatedById,CreatedDate,LastModifiedById,LastModifiedDate FROM CommandActionParam];
    }
    
    @AuraEnabled
    global static List<Object> listCommandIntentFragments() {
        return [SELECT Id,Index,IntentId,WordFragmentId,CreatedById,CreatedDate,LastModifiedById,LastModifiedDate FROM CommandIntentFragment];
    }

    @AuraEnabled
    global static List<Object> listCommandIntentParams() {
        return [SELECT Id,ActionIntentId,ActionParameterId,CreatedById,CreatedDate,LastModifiedById,LastModifiedDate FROM CommandIntentParam];
    }
    
    @AuraEnabled
    global static List<Object> listCommandWordFragments() {
        return [SELECT Id,Fragment,CreatedById,CreatedDate,LastModifiedById,LastModifiedDate FROM CommandWordFragment];
    }

}