/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';

export default class LwcSelect extends LightningElement {
    @track _label;
    @track _options;
    @track _value;
    @track change;

    @api
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
    }

    @api
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }

    handleChange(evt) {
        console.warn('lwcSelect.handleChange evt.target.value: ', evt.target.value);
        console.warn('lwcSelect.handleChange this._value: ', this._value);

        const changeEvent = new CustomEvent('change', {
            detail: { assetId: evt.target.value }
        });
        console.warn('changeEvent: ', changeEvent);
        this.dispatchEvent(changeEvent); 

        /*
        this._value = evt.target.value;
        const changeEvent = new CustomEvent('onchange', { detail: { cmp:} });
        this.dispatchEvent(waveSDKEvent); 
        this.dispatchEvent(
            new CustomEvent('onchange')
        );
        */        
    }

    changeHandler(evt) {
        console.warn('lwcSelect.changeHandler');
        console.warn('lwcSelect.changeHandler: ', evt.target.value);
        const changeEvent = new CustomEvent('change', { detail: { evt: evt} });
        this.dispatchEvent(changeEvent); 
    }

    @api
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
}