<aura:application extends="force:slds">
    <aura:attribute name="items" type="Object"/>
	<lightning:tree items="{!v.items}"/>
</aura:application>