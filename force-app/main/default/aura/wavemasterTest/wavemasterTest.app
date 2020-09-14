<aura:application extends="force:slds">
    <aura:attribute name="paused" type="Boolean" access="global" default="false"/>
    <div class="outer">
        <lightning:layout class="header fixed slds-border_bottom slds-m-below_small">
            <lightning:layoutItem class="einstein" size="6">
                <lightning:input type="checkbox" checked="{!v.paused}" label="Paused"/>
                <c:wavemaster paused="{!v.paused}"/>
                
                <!--
                <div class="container">
                    <div class="main">
                        <div class="ocean">
                            <div class="wave"></div>
                            <div class="wave"></div>
                        </div>                
                    </div>
                </div>
				-->
            </lightning:layoutItem>
        </lightning:layout>
    </div>
    
</aura:application>