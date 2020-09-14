import { LightningElement, api, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import tableauJSAPI from '@salesforce/resourceUrl/TableauJSAPI';

export default class TableauViz extends LightningElement {


    @api objectApiName;
    @api recordId;
    @api vizURL;
    @api hideTabs;
    @api hideToolbar;
    @api filter;
    @api height;
    viz;
    errorMessage;
    vizDisplayed;
    vizToLoad;

    constructor() {
        super();

        console.warn('tableauViz lwc - constructor');
        
        this.template.addEventListener('onmarksselection', this.handleTest);
    }

    handleTest = () => {
        console.warn('tableauViz lwc - handleTest: ');
    };    

    get isVizDisplayed() {
        this.createErrorMessage();
        this.vizDisplayed = this.validURL(this.vizURL);
        return this.vizDisplayed;
    }

    createErrorMessage() {
        if (!this.validURL(this.vizURL)) {
            this.errorMessage = 'Invalid Viz URL';
        } else {
            this.errorMessage = 'Invalid Input';
        }
    }

    //Check if the URL is valid
    validURL(str) {
        try {
            this.vizToLoad = new URL(str);
        } catch (_) {
            return false;
        }

        return true;
    }

    onMarksSelection(marksEvent) {
        console.warn('tableauViz lwc - onMarksSelection: ', marksEvent);

        marksEvent.getMarksAsync().then(function(marks) {
            console.warn('marks: ', marks);

            let payload = JSON.stringify(marks);
            
            console.warn('payload: ', payload);

            const lwcMarksEvent = new CustomEvent('marksselection', {payload: payload});
            
            this.dispatchEvent(lwcMarksEvent);



        });

        return;


        return marksEvent.getMarksAsync().then(function(marks) {
            console.warn('marks: ', marks);
            marks.forEach(function(mark) {
                console.warn('mark: ', mark);
                let pairs = mark.getPairs();
                console.warn('pairs: ', pairs);
                pairs.forEach(function(pair) {
                    console.warn('pair: ', pair);
                    console.warn(pair.fieldName);
                    console.warn(pair.value);
                    console.warn(pair.formattedValue);
                });
            });

            let payload = JSON.stringify(marks);
            
            console.warn('payload: ', payload);

            const lwcMarksEvent = new CustomEvent('onmarksselection', {payload: payload});
            
            self.dispatchEvent(lwcMarksEvent);


        });
    }

    propagateEvents = true;

    @api
    select(selection) {
        console.warn('tableauViz lwc - select called: ', selection);
        let val = null;

        console.warn('this: ', this);
        let viz = this.viz;
        console.warn('viz: ', viz);
        let workbook = this.viz.getWorkbook();
        console.warn('workbook: ', workbook);


        // Note that getActiveSheet returns a collection of sheets, not the active sheet
        let sheets = workbook.getActiveSheet().getWorksheets();
        console.warn('sheets: ', sheets);

        // For now using the first sheet in the collection as most/all don't return true on getIsActive()
        let sheet = sheets[0];
        console.warn('sheet: ', sheet);

        let self = this;

        // Do not propagate events when setting them
        // Trying to avoid a ping-pong effect
        self.propagateEvents = false;

        let fieldValue = null;
        for (let fieldName in selection) {
            fieldValue = selection[fieldName];

            console.warn('calling sheet.selectMarksAsync with ', fieldName, fieldValue);
            sheet.selectMarksAsync(fieldName, fieldValue, tableau.SelectionUpdateType.REPLACE);
        }
            

        // Is there a better way to turn propagation back on?
        // Maybe an event?
        setTimeout(function() {
            self.propagateEvents = true;
        }, 2000);

        console.warn('done');
    }

    @api
    applyFilter(filter) {
        console.warn('tableauViz lwc - select called: ', filter);
        let val = null;

        console.warn('this: ', this);
        let viz = this.viz;
        console.warn('viz: ', viz);
        let workbook = this.viz.getWorkbook();
        console.warn('workbook: ', workbook);


        // Note that getActiveSheet returns a collection of sheets, not the active sheet
        let sheets = workbook.getActiveSheet().getWorksheets();
        console.warn('sheets: ', sheets);

        // For now using the first sheet in the collection as most/all don't return true on getIsActive()
        let sheet = sheets[0];
        console.warn('sheet: ', sheet);

        let self = this;

        // Do not propagate events when setting them
        // Trying to avoid a ping-pong effect
        self.propagateEvents = false;

        let fieldValue = null;
        for (let fieldName in filter) {
            fieldValue = filter[fieldName];

            console.warn('calling sheet.applyFilterAsync with ', fieldName, fieldValue);
            sheet.applyRangeFilterAsync(fieldName, fieldValue, tableau.FilterUpdateType.REPLACE);
        }
            

        // Is there a better way to turn propagation back on?
        // Maybe an event?
        setTimeout(function() {
            self.propagateEvents = true;
        }, 2000);

        console.warn('done');
    }


/*
    @api
    get selectedMarksAsync(callback) {
        console.warn('tableauViz lwc - getMarks called');
        
        let self = this;

        if (self.viz) {
            let sheet = self.viz.getWorkbook().getActiveSheet();
            console.warn('sheet: ', sheet);
            if (sheet) {


                sheet.getSelectedMarksAsync().then(function(marks) {
                    console.warn('marks: ', marks);
        
                    if (typeof callback === 'function') {
                        callback(null, marks);
                    }
        
                    const lwcMarksEvent = new CustomEvent('marksselection', {detail: {marks: marks, payload: payload}});
                    
                    console.warn('lwcMarksEvent: ', lwcMarksEvent);

                    self.dispatchEvent(lwcMarksEvent);

                    console.warn('done');
        
                });
            }            
        }
        

        return;
    }
*/

    @api
    get marks() {
        console.warn('tableauViz lwc - getMarks called');
        
        let self = this;

        if (this.viz) {
            let sheet = this.viz.getWorkbook().getActiveSheet();
            console.warn('sheet: ', sheet);
            if (sheet) {


                sheet.getSelectedMarksAsync().then(function(marks) {
                    console.warn('marks: ', marks);
        
                    let payload = JSON.stringify(marks);
                    
                    console.warn('payload: ', payload);
        
                    const lwcMarksEvent = new CustomEvent('marksselection', {detail: {marks: marks, payload: payload}});
                    
                    console.warn('lwcMarksEvent: ', lwcMarksEvent);

                    self.dispatchEvent(lwcMarksEvent);
        
                    console.warn('done');
        
                });
            }            
        }
        

        return;
    }

    set marks(value) {
        console.warn('tableauViz lwc - setMarks called: ', value);
        if (this.viz) {
            let sheet = this.viz.getWorkbook().getActiveSheet();
            console.warn('sheet: ', sheet);
            if (sheet) {                
                for (var markIndex = 0; markIndex < value.length; markIndex++) {
                    var mark = value[markIndex];
                    console.warn('mark: ', mark);
                    sheet.selectMarksAsync(mark.name, mark.value, tableau.SelectionUpdateType.ADD);
                }
            }            
        }
    }

    async renderedCallback() {
        await loadScript(this, tableauJSAPI);
        const containerDiv = this.template.querySelector('div');

        // Need to dispose the viz to make it dynamic
        if (this.viz !== null && typeof this.viz !== 'undefined') {
            this.viz.dispose();
        }

        if (this.vizDisplayed) {
            //Defining the height of the div
            containerDiv.style.height = this.height + 'px';

            //Getting Width of the viz
            const vizWidth = containerDiv.offsetWidth;

            //Define size of the viz
            this.vizToLoad.searchParams.append(
                ':size',
                vizWidth + ',' + this.height
            );

            //In context filtering
            if (this.filter === true && this.objectApiName) {
                const filterNameTab = `${this.objectApiName} ID`;
                this.vizToLoad.searchParams.append(
                    filterNameTab,
                    this.recordId
                );
            }

            let vizURLString = this.vizToLoad.toString();
            const options = {
                hideTabs: this.hideTabs,
                hideToolbar: this.hideToolbar,
                height: this.height + 'px',
                width: '100%'
            };

            // eslint-disable-next-line no-undef
            this.viz = new tableau.Viz(containerDiv, vizURLString, options);
            
            console.warn('tableau.SelectionUpdateType.REPLACE: ', tableau.SelectionUpdateType.REPLACE);
            console.warn('tableau.SelectionUpdateType.ADD: ', tableau.SelectionUpdateType.ADD);
            console.warn('tableau.SelectionUpdateType.REMOVE: ', tableau.SelectionUpdateType.REMOVE);

            let self = this;

            this.viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, function(marksSelectionEvent) {

                if (self.propagateEvents === true) {
                    console.warn('tableauViz lwc - MARKS_SELECTION event: ', marksSelectionEvent);

                    marksSelectionEvent.getMarksAsync().then(function(marks) {
                        console.warn('marks: ', marks);
                    
                        const lwcMarksSelectionEvent = new CustomEvent('marks_selection', {detail: {marks: marks}});
                        
                        console.warn('lwcMarksSelectionEvent: ', lwcMarksSelectionEvent);

                        self.dispatchEvent(lwcMarksSelectionEvent);
            
                        console.warn('done');
            
                    });
                }
            });

            this.viz.addEventListener(tableau.TableauEventName.FILTER_CHANGE, function(filterChangeEvent) {

                if (self.propagateEvents === true) {
                    console.warn('tableauViz lwc - FILTER_CHANGE event: ', filterChangeEvent);

                    filterChangeEvent.getFilterAsync().then(function(filter) {
                        console.warn('filter: ', filter);
                            
                        const lwcFilterChangeEvent = new CustomEvent('filter_change', {detail: {filter: filter}});
                        
                        console.warn('lwcFilterChangeEvent: ', lwcFilterChangeEvent);

                        self.dispatchEvent(lwcFilterChangeEvent);
            
                        console.warn('done');
            
                    });
                }
            });

            this.viz.addEventListener(tableau.TableauEventName.PARAMETER_VALUE_CHANGE, function(parameterValueChangeEvent) {

                console.warn('tableauViz lwc - FILTER_CHANGE event: ', parameterValueChangeEvent);

                parameterValueChangeEvent.getFilterAsync().then(function(parameter) {
                    console.warn('parameter: ', parameter);
                        
                    const lwcParameterValueChangeEvent = new CustomEvent('parameter_value_change', {detail: {parameter: parameter}});
                    
                    console.warn('lwcParameterValueChangeEvent: ', lwcParameterValueChangeEvent);

                    self.dispatchEvent(lwcParameterValueChangeEvent);
        
                    console.warn('done');
        
                });

            });


        }
    }
}