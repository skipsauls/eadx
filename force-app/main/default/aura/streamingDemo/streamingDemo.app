<aura:application >
    <aura:attribute name="lastMessagePayload" type="String" access="private"/>
    <c:streaming channel="/event/MyEvent__e" onMessage="{!c.handleMessage}"/>
    <lightning:card title="Test">
        <div>{!v.lastMessagePayload}</div>
    </lightning:card>
</aura:application>