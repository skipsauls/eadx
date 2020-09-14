public with sharing class VoiceSFXController {
    @AuraEnabled
    public static List<Map<String, String>> getSoundResourceInfo(String resourceName) {
        StaticResource res = [SELECT Id,Name,BodyLength,ContentType,Body FROM StaticResource WHERE NAME =: resourceName];
        Zippex sampleZip = new Zippex(res.Body);
        Set <String> fileNames = sampleZip.getFileNames();
        Map <String, String> fileInfoMap = null;
        Blob fileData = null;
        List<Map<String, String>> resourceInfo = new List<Map<String, String>>();
        for (String fileName: fileNames) {
            fileInfoMap = sampleZip.getFileInfo(fileName);
            System.debug('file: ' + fileName);
            for (String name: fileInfoMap.keySet()) {
                System.debug(name + ': ' + fileInfoMap.get(name));
            }
            if (!fileInfoMap.get('fileName').contains('__MACOSX')) {
                resourceInfo.add(fileInfoMap);
            }
            // Do not get the info as it can blow the stack!!!!
            //fileData = sampleZip.getFile(fileName);
        }
        return resourceInfo; 
    }
}