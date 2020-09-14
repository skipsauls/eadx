<aura:application extends="force:slds">
    <aura:attribute name="isLoaded" type="Boolean"/>
    <aura:handler name="change" value="{!v.isLoaded}" action="{!c.handleIsLoaded}"/>
    
    <div>
    	App level - isLoaded: {!v.isLoaded}
    </div>
    
    <c:lifecycleDemoTab isLoaded="{!v.isLoaded}"/>
</aura:application>