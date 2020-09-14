<aura:application extends="force:slds">
    <c:analyticsEventMonitor />
    
    <c:soqlDatatable objectApiName="Account"
                     listName="RecentlyViewedAccounts"
                     rows="5"
                     />
    
    <wave:waveDashboard developerName="df17eadx__Manager_Overview"
                        height="700"
                        openLinksInNewWindow="false"
                        showHeader="false"
                        showTitle="false"
                        showSharing="false"
                        />
</aura:application>