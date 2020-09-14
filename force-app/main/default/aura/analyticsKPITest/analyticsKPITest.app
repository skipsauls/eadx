<aura:application extends="force:slds" access="global">
    <aura:attribute name="saql" type="String" access="global"/>
    <aura:attribute name="lenses" type="List" access="global"/>
    <aura:attribute name="lensDevName" type="String" access="global"/>
    <aura:handler name="init" value="{!this}" action="{!c.init}"/>
    
    <wave:sdk aura:id="sdk"/>
    
    <div class="outer">
        <lightning:select name="selectLens" label="Lenses" value="{!v.lensDevName}">
            <option value="">choose one...</option>
            <aura:iteration items="{!v.lenses}" var="lens">
                <option value="{!(lens.namespace ? lens.namespace + '__' : '') + lens.name}">{!lens.label}</option>
            </aura:iteration>
        </lightning:select>        
        <c:analyticsKPI saql="{!v.saql}" lensDevName="{!v.lensDevName}"/>
        
        <hr/>
		<div>
            <c:kpiView lensDevName="KPI Test" kpiName="Max Amount" saql="{!v.saql}"/>
        </div>
    </div>
</aura:application>