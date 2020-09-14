<aura:application template="c:embedAppTemplate">
    <aura:attribute name="dashboardId" type="String" access="global" default="0FKB0000000E1iROAS"/>
    <aura:attribute name="height" type="String" access="global" default="800"/>
    
    <aura:handler name="init" value="{!this}" action="{!c.refresh}"/>
    
    <aura:handler event="wave:selectionChanged" action="{!c.handleSelectionChanged}"/>
    
    <lightning:button label="Refresh" onclick="{!c.refresh}"/>
    <lightning:button label="Test" onclick="{!c.test}"/>
    
    <div aura:id="dashboard" class="dashboard-container"/>
    
</aura:application>