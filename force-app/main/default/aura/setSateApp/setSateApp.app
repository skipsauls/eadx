<aura:application >
    <lightning:button variant="brand" label="Set State" title="Set State" onclick="{! c.handleSetSate }" />
    <lightning:button variant="brand" label="Get State" title="Get State" onclick="{! c.handleGetSate }" />
	<wave:waveDashboard aura:id="dashboard_1"
                                                    developerName="0FKB0000000UMuROAW"
                                                    height="700"
                                                    showHeader="false"
                                                    showTitle="false"
                                                    showSharing="false"
                                                    />
</aura:application>