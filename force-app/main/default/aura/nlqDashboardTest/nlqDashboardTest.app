<aura:application access="global" extends="force:slds" controller="ApexSAQLQueryController">
    <aura:attribute name="queryName" type="String" default="test"/>
    <aura:attribute name="saql" type="String" default=""/>
    
    <aura:handler name="init" value="{!this}" action="{!c.init}"/>
    
    <div class="main">
        <lightning:textarea class="editor" label="SAQL" value="{!v.saql}"/>
        <lightning:button label="Update" onclick="{!c.doUpdateQuery}"/>
        <c:nlqDashboard aura:id="nlqDashboard" queryName="{!v.queryName}" saql="{!v.saql}"/>
    </div>
</aura:application>