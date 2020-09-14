global with sharing class WelcomeController {

    @AuraEnabled
    global static List<Map<String, Object>> getTabs() {
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.describeTabs();
        
        List<Map<String, Object>> tabSetList = new List<Map<String, Object>>();
        Map<String, Object> tabSet = null;
        Map<String, Object> tab = null;
        List<Map<String, Object>> tabs = null;
        
        for(DescribeTabSetResult tsr : tabSetDesc) {
            tabSet = new Map<String, Object>();
            tabSet.put('label', tsr.getLabel());
            tabSet.put('logoUrl', tsr.getLogoUrl());
            tabSet.put('selected', tsr.isSelected());
            tabSet.put('namespace', tsr.getNamespace());
          
            List<Schema.DescribeTabResult> tabDesc = tsr.getTabs();
            
            tabs = new List<Map<String, Object>>();
            for(Schema.DescribeTabResult tr : tabDesc) {
                tab = new Map<String, Object>();
                tab.put('label', tr.getLabel());
                tab.put('colors', tr.getColors());
                tab.put('iconUrl', tr.getIconUrl());
                tab.put('icons', tr.getIcons());
                tab.put('miniIconUrl', tr.getMiniIconUrl());
                tab.put('SObjectName', tr.getSObjectName());
                tab.put('url', tr.getUrl());
                tab.put('custom', tr.isCustom());
                
                tabs.add(tab);
            }
            
            tabSet.put('tabs', tabs);
            
            
            tabSetList.add(tabSet);
        }
                    
        return tabSetList;
    }
    
}