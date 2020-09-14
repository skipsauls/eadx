/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';

export default class LwcSDKTest extends LightningElement {
    
    _response;
    @track jsonResponse;
    @track dashboards;
    @track lenses;
    @track datasets;
    @track folders;
    @track templates;

    @track dashboardsOptions;
    @track lensesOptions;
    @track datasetsOptions;
    @track foldersOptions;
    @track templatesOptions;

    @api
    sdkReference;
/*
    @api
    get sdkReference() {
        console.warn('get sdkReference');
        return this.sdkReference;
    }

    set sdkReference(ref) {
        console.warn('set sdkReference: ', ref);
        this.sdkReference = ref;
    }

    @api
    get waveSDKResponse() {
        console.warn('get waveSDKResponse');
        return this._response;
    }
    set waveSDKResponse(value) {
        this._response = value;
        let obj = JSON.parse(value);
        let json = JSON.stringify(obj, null, 2);
        this.jsonResponse = json;
        if (obj.responseName) {
            this[obj.responseName] = obj[obj.responseName];

            // Create options for comboboxes
            let assets = obj[obj.responseName];
            let options = [];
            assets.forEach(function(asset) {
                options.push({value: asset.id, label: asset.label});
            });
            //this[obj.responseName + 'Options'] = options;
        }
    }
   
    updateWaveSDKResponse() {
        console.warn('updateWaveSDKResponse: ', this.waveSDKResponse);
    }
*/
    listAssets(context, methodName, methodParameters, responseName) {
        let self = this;

        self.sdkReference.invokeMethod(context, methodName, methodParameters, function(err, data) {

            if (err) {
                console.error('wave:sdk.invokeMethod error: ', err);
            } else {
                //let value = JSON.stringify(data);
                //let obj = JSON.parse(value);
                let json = JSON.stringify(data, null, 2);
                self.jsonResponse = json;

                if (data[responseName]) {
                    self[responseName] = data[responseName];
        
                    // Create options for comboboxes
                    let assets = data[responseName];
                    let options = [];
                    assets.forEach(function(asset) {
                        options.push({value: asset.id, label: asset.label});
                    });
                    self[responseName + 'Options'] = options;
                }    
            }
        });
    }

    handleListDashboards() {
        let context = { apiVersion: "46" };
        let methodName = 'listDashboards';
        let methodParameters = {};
        let responseName = 'dashboards';

        this.listAssets(context, methodName, methodParameters, responseName);      
    }

    handleListLenses() {
        let context = { apiVersion: "46" };
        let methodName = 'listLenses';
        let methodParameters = {};
        let responseName = 'lenses';

        this.listAssets(context, methodName, methodParameters, responseName);
    }

    handleListDatasets() {
        let context = { apiVersion: "46" };
        let methodName = 'listDatasets';
        let methodParameters = {};
        let responseName = 'datasets';

        this.listAssets(context, methodName, methodParameters, responseName);
    }

    handleListFolders() {
        let context = { apiVersion: "46" };
        let methodName = 'listFolders';
        let methodParameters = {};
        let responseName = 'folders';

        this.listAssets(context, methodName, methodParameters, responseName);
    }

    handleListTemplates() {
        let context = { apiVersion: "46" };
        let methodName = 'listTemplates';
        let methodParameters = {};
        let responseName = 'templates';

        this.listAssets(context, methodName, methodParameters, responseName);
    }

    handleSelectDashboard(evt) {
        //let id = evt.target.value;
        console.warn('handleSelectDashboard evt: ', evt);
        console.warn('handleSelectDashboard evt.target: ', evt.target);
        console.warn('handleSelectDashboard evt.detail: ', evt.detail);
    }
}