<aura:application extends="force:slds">
    <aura:attribute name="developerNameA" type="String" access="global" default="eadx__Demo_Dashboard_2"/>   
    <aura:attribute name="developerNameB" type="String" access="global" default="eadx__Demo_Dashboard_3"/>
    <aura:attribute name="switch" type="String" access="global" default="A"/>
    <aura:registerEvent name="update" type="wave:update"/>
    
    <lightning:button label="Switch" onclick="{!c.doSwitch}"/>
    <lightning:button label="Fire" onclick="{!c.doFire}"/>
    <wave:waveDashboard developerName="{!v.switch == 'A' ? v.developerNameA : v.developerNameB}" height="700"/>
    
</aura:application>