<aura:application extends="force:slds" access="global">
    
    <aura:attribute name="userText" type="String"/>
    <aura:attribute name="systemText" type="String"/>
    
    <div style="width: 320px; outline: 1px solid black; margin: 5px; padding: 5px;">
        <c:voiceLog aura:id="voiceLog" height="24rem"/>
        <lightning:input type="text" label="User" value="{!v.userText}"/>
        <lightning:button label="Submit User" onclick="{!c.submitUser}"/>
        
        <lightning:input type="text" label="System" value="{!v.systemText}"/>
        <lightning:button label="Submit System" onclick="{!c.submitSystem}"/>
    </div>    
    
</aura:application>