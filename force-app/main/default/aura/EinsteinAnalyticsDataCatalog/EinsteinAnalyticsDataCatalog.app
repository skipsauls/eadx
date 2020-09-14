<aura:application extends="force:slds" template="c:EinsteinAnalyticsDataCatalogTemplate">
    
    
    <div class="desktop container forceStyle oneOne lafStandardLayoutContainer lafAppLayoutHost forceAccess forceStyle oneOne">
        <div class="viewport">
            <section class="stage panelSlide" style="top: 90px; height: calc(100% - 90px)">
                
                <header class="slds-global-header_container">
                    <a href="javascript:void(0);" class="slds-assistive-text slds-assistive-text_focus">Skip to Navigation</a>
                    <a href="javascript:void(0);" class="slds-assistive-text slds-assistive-text_focus">Skip to Main Content</a>
                    <div class="slds-global-header slds-grid slds-grid_align-spread">
                        <div class="slds-global-header__item">
                            <div class="slds-global-header__logo"></div>
                        </div>
                        
                    </div>
                </header>
                <div class="slds-brand-band slds-brand-band_cover slds-brand-band_medium slds-template_default">
                    <div class="slds-template__container">
                        <c:appGraphTab/>
                    </div>
                </div>
                
            </section>
        </div>    
    </div>
    
</aura:application>