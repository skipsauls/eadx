<aura:application access="global" extends="force:slds">
    <section class="main-content">
      <div class="slds-grid slds-wrap slds-grid--pull-padded slds-p-around--medium">
        <div class="slds-p-horizontal--small slds-size--1-of-2 slds-medium-size--2-of-6 slds-large-size--4-of-12">
            <c:eaPlatformEventManager />
            <c:eaPlatformEventTester />
		</div>
        <div class="slds-p-horizontal--small slds-size--1-of-2 slds-medium-size--4-of-6 slds-large-size--8-of-12">
            <wave:waveDashboard dashboardId="0FKB00000003fBpOAI" height="650" showTitle="false" showHeader="false"/>
		</div>
      </div>
    </section>
</aura:application>