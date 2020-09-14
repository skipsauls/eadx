<aura:application extends="force:slds">
    <aura:attribute name="developerName" type="String" access="GLOBAL" description="The developer name of the dashboard" default="eadx__Fortnite1"/>
    <aura:attribute name="height" type="String" access="GLOBAL" description="Height of the dashboard." default="1024"/>
    <div class="outer">
        <wave:waveDashboard developerName="{!v.developerName}" height="{!v.height}" showHeader="false" showTitle="false" showSharing="false"/>    
    </div>
</aura:application>