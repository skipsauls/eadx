<aura:application extends="force:slds">

    <aura:attribute name="rendered" type="Boolean" access="global"/>
    
    <wave:waveDashboard developerName="eadx__Demo_Dashboard_2" height="700" rendered="{!v.rendered}"/>
    
</aura:application>