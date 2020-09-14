<aura:application extends="force:slds" access="global">
	
    <aura:attribute name="dashboardId" type="String" access="global" default="0FK1I000000DvHUWA0"/>
    
    <section class="main-content">
      <div class="slds-grid slds-wrap slds-grid--pull-padded slds-p-around--medium">
        <div class="slds-p-horizontal--small slds-size--1-of-2 slds-medium-size--2-of-6 slds-large-size--4-of-12">
            <c:mockEditor dashboardId="{!v.dashboardId}"/>
		</div>

        <div class="slds-p-horizontal--small slds-size--1-of-2 slds-medium-size--4-of-6 slds-large-size--8-of-12">
            <article class="slds-card">
	            <wave:waveDashboard dashboardId="{!v.dashboardId}" height="750" showTitle="false" showHeader="false"/>
            </article>
		</div>
          
      </div>
    </section>
    
</aura:application>