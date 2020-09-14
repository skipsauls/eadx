<aura:application access="global" extends="force:slds">
	
    <div>
        <lightning:button label="Test" onclick="{!c.test}"/>        
    </div>
    
    <c:sdkWrapper aura:id="sdkWrapper"/>
    
</aura:application>