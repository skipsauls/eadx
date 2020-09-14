<aura:application access="global" extends="force:slds">
    <aura:attribute name="dashboardId" type="String" access="global"/>	
    <aura:attribute name="dashboardIds" type="String[]" access="global" default="0FKB0000000ULcIOAW,0FKB0000000L3cTOAS,0FKB0000000AXgeOAG"/>
    <aura:attribute name="index" type="Integer" access="global" default="-1"/>
    <aura:attribute name="isLoaded" type="Boolean" access="global"/>
	<aura:handler name="init" value="{!this}" action="{!c.change}" />
    <h1>isLoaded: {!v.isLoaded}</h1>
    <lightning:button label="Change" onclick="{!c.change}"/>
   	<div class="{!v.isLoaded == true ? 'slds-show' : 'slds-hide'}">
        <wave:waveDashboard dashboardId="{!v.dashboardId}" height="600" isLoaded="{!v.isLoaded}"/>
    </div>
   	<div class="{!v.isLoaded != true ? 'slds-show' : 'slds-hide'}">
        <h1>We are preparing your Analytics Experience!</h1>    
    </div>
</aura:application>