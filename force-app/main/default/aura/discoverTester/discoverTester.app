<aura:application extends="force:slds">
	<div class="outer">
    	<lightning:layout>
        	<lightning:layoutItem size="2" padding="horizontal-small">
                <c:discoverTest/>
            </lightning:layoutItem>
        	<lightning:layoutItem size="10" padding="horizontal-small">
                <wave:waveDashboard developerName="eadx__Dashboard_A" height="300" showHeader="false" showTitle="false" showSharing="false"/>
                <wave:waveDashboard developerName="eadx__Dashboard_B" height="300" showHeader="false" showTitle="false" showSharing="false"/>
            </lightning:layoutItem>
        </lightning:layout>
    </div>
</aura:application>