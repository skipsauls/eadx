<aura:application access="global" controller="ApexMath">
    
    <aura:attribute name="val" type="String" access="global" default="2"/>
    <aura:attribute name="exp" type="String" access="global" default="256"/>
    <aura:attribute name="count" type="String" access="global" default="100000"/>
    <aura:attribute name="target" type="String" access="global" default="Einstein"/>
    <aura:attribute name="match" type="String" access="global" default="stein"/>
    <aura:attribute name="results" type="String" access="global"/>
    
    <div>
        <div>
            <lightning:input type="text" name="count" label="count" value="{!v.count}"/>
        </div>
        
        <div>
            <lightning:input type="text" name="val" label="d" value="{!v.val}"/>
            <lightning:input type="text" name="exp" label="exp" value="{!v.exp}"/>
            <lightning:button label="Lightning" onclick="{!c.calcLightning}"/>
            <lightning:button label="Apex" onclick="{!c.calcApex}"/>
        </div>
        
        <div>
            <lightning:input type="text" name="target" label="target" value="{!v.target}"/>
            <lightning:input type="text" name="match" label="match" value="{!v.match}"/>
            <lightning:button label="Lightning" onclick="{!c.strLightning}"/>
            <lightning:button label="Apex" onclick="{!c.strApex}"/>
        </div>
        
        <textarea value="{!v.results}"/>
    </div>
</aura:application>