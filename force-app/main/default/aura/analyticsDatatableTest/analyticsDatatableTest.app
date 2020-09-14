<aura:application extends="force:slds">
    <aura:attribute name="saql" type="String" access="global"/>
	<aura:handler name="init" value="{!this}" action="{!c.init}"/>    
    <c:analyticsDatatable saql="{!v.saql}" keyField="Id"/>
</aura:application>