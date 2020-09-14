<aura:application extends="force:slds">
    <aura:attribute name="log" type="String[]" access="global"/>
    <aura:attribute name="acceleration" type="Object" access="global"/>
    <aura:attribute name="accelerationIncludingGravity" type="Object" access="global"/>
    <aura:attribute name="rotationRate" type="Object" access="global"/>
    <aura:attribute name="refreshInterval" type="Object" access="global"/>
    <aura:attribute name="orientation" type="Object" access="global"/>
    
    <aura:attribute name="running" type="Boolean" access="global" default="false"/>
    <aura:attribute name="interval" type="Object" access="global"/>
    <aura:attribute name="duration" type="Integer" access="global" default="500"/>

    <aura:attribute name="latest" type="Object" access="global"/>
    <aura:attribute name="history" type="Object[]" access="global"/>

    <aura:attribute name="position" type="Object" access="global"/>
    
    <img class="orientee"
         style="{!'transform: rotate(' + v.orientation.gamma + 'deg) rotate3d(1, 0, 0, ' + v.orientation.beta + 'deg)'}"
         src="https://developer.salesforce.com/resource/images/trailhead/offers/Astro+with+badge.png"
         alt="The HTML5 logo"
         aura:id="orientee"
         />
    <div>
        <lightning:button label="{!(v.running == true) ? 'Stop' : 'Start'}" onclick="{!c.toggleRunning}"/>
	</div>
    <h1>history length: {!v.history.length}</h1>
    <div>
	    <h1>Latest</h1>
    	<h1>{!v.latest.acceleration.x}, {!v.latest.acceleration.y}, {!v.latest.acceleration.z}</h1>
	    <h1>Position</h1>
    	<h1>{!v.position.x}, {!v.position.y}, {!v.position.z}</h1>
    </div>
    <!--
    <div>
    	<h1>acceleration</h1>
    	<h1>x: {!v.acceleration.x}</h1>
    	<h1>y: {!v.acceleration.y}</h1>
    	<h1>z: {!v.acceleration.z}</h1>
    </div>
    
    <div>
    	<h1>accelerationIncludingGravity</h1>
    	<h1>x: {!v.accelerationIncludingGravity.x}</h1>
    	<h1>y: {!v.accelerationIncludingGravity.y}</h1>
    	<h1>z: {!v.accelerationIncludingGravity.z}</h1>
    </div>

    <div>
    	<h1>rotationRate</h1>
    	<h1>alpha: {!v.rotationRate.alpha}</h1>
    	<h1>beta: {!v.rotationRate.beta}</h1>
    	<h1>gamma: {!v.rotationRate.gamma}</h1>
    </div>

    <div>
    	<h1>refreshInterval: {!v.refreshInterval}</h1>
    </div>

    <div>
    	<h1>orientation</h1>
    	<h1>alpha: {!v.orientation.alpha}</h1>
    	<h1>beta: {!v.orientation.beta}</h1>
    	<h1>gamma: {!v.orientation.gamma}</h1>
    	<h1>absolute: {!v.orientation.absolute}</h1>
    </div>
    -->
    
    <!--
    <ul>
        <aura:iteration items="{!v.log}" var="line">
            <li>{!line}</li>
        </aura:iteration>
    </ul>
	-->
</aura:application>