<aura:application access="global" extends="force:slds">
    <aura:attribute name="type" type="String" access="global" default="sum"/>
    <aura:attribute name="values" type="String" access="global" default="1,2,3"/>
    <c:fincalc aura:id="fincalc"/>
    <lightning:input type="text" name="values" label="Values" value="{!v.values}"/>
    <lightning:button label="Test" onclick="{!c.test}"/>
</aura:application>