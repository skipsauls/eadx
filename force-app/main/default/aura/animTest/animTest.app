<aura:application extends="force:slds">
    <aura:attribute name="counter" type="Integer" default="0"/>
    <aura:attribute name="interval" type="Integer" default="100"/>
    <aura:attribute name="timestamp" type="Integer" default="0"/>
    <aura:attribute name="globalId" type="String"/>    
    
    <lightning:button label="Start" onclick="{!c.start}"/>
    <lightning:button label="Stop" onclick="{!c.stop}"/>
    <h1>Counter: {!v.counter}</h1>
    <h1>Timestamp: {!v.timestamp}</h1>

</aura:application>