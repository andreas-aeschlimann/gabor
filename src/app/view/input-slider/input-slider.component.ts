import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: "app-input-slider",
    templateUrl: "./input-slider.component.html",
    styleUrls: ["./input-slider.component.scss"],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputSliderComponent),
        multi: true
    }]

})
export class InputSliderComponent implements OnInit, ControlValueAccessor {

    @Input("min") min = 0;
    @Input("max") max = 10;
    @Input("step") step = 1;

    value: number = this.min;


    /**
     * Invoked when the model has been changed
     */
    onChange: (_: any) => void = (_: any) => {};

    /**
     * Invoked when the model has been touched
     */
    onTouched: () => void = () => {};


    constructor() {
    }

    ngOnInit() {
    }

    /**
     * Method that is invoked on an update of a model.
     */
    updateChanges() {
        this.onChange(this.value);
    }

    ///////////////
    // OVERRIDES //
    ///////////////


    /**
     * Writes a new item to the element.
     * @param value
     */
    writeValue(value: number): void {

        if (value === undefined) value = this.min;

        this.value = value;
        this.updateChanges();

    }

    /**
     * Registers a callback function that should be called when the control"s value changes in the UI.
     * @param fn
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Registers a callback function that should be called when the control receives a blur event.
     * @param fn
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

}
