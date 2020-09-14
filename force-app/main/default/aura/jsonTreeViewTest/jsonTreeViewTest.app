<aura:application access="global" extends="force:slds">
    <aura:attribute name="json" type="String" access="global"/>
    <aura:attribute name="selectedItem" type="Object" access="global"/>    
    
    <aura:handler name="init" value="{!this}" action="{!c.init}"/>
    
    <div class="outer">
        <h1>Selected Item: {!v.selectedItem.label} - {!v.selectedItem.value}</h1>
        <div>
            <c:jsonTreeView json='{!v.json}' selectedItem="{!v.selectedItem}"/>
        </div>
        
    </div>
</aura:application>