<aura:application access="global" extends="force:slds">
	<aura:registerEvent name="update" type="wave:update"/>    
	<aura:handler event="wave:selectionChanged" action="{!c.onWaveSelectionChanged}"/>     
	<aura:handler name="init" value="{!this}" action="{!c.init}" />    
    <c:analyticsExplorer />
</aura:application>