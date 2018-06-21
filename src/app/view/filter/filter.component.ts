import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";

import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {ImageProcessingService} from "../../model/math/image-processing.service";

import {CanvasImage} from "../../model/other/canvas-image";

@Component({
    selector: "app-filter",
    templateUrl: "./filter.component.html",
    styleUrls: ["./filter.component.scss"]
})
export class FilterComponent implements OnInit, AfterViewInit {

    ///////////////////
    // FILTER PARAMS //
    ///////////////////


    /**
     * Gabor filter parameter for the dilation in x or y
     * @type {number}
     */
    xi: number = 0.5;

    /**
     * Gabor filter parameter for the width
     * @type {number}
     */
    sigma: number = 1;

    /**
     * Gabor filter parameter for the wavelength of the sinusoid part
     * @type {number}
     */
    lambda: number = 4;

    /**
     * Gabor filter parameter for the original angle
     * @type {number}
     */
    theta: number = 0;


    /////////////////
    // CANVAS DATA //
    /////////////////


    /**
     * Filter canvas html element
     * @type {ElementRef}
     */
    @ViewChild("filterRealCanvas") filterRealCanvas: ElementRef;

    /**
     * Filter canvas html element
     * @type {ElementRef}
     */
    @ViewChild("filterImagCanvas") filterImagCanvas: ElementRef;

    /**
     * The filter canvas image
     * @type {CanvasImage}
     */
    filterRealCanvasImage: CanvasImage;

    /**
     * The filter canvas image
     * @type {CanvasImage}
     */
    filterImagCanvasImage: CanvasImage;

    /**
     * The default pixel size of the canvas
     * @type {number}
     */
    imageSize: number = 1024;


    /////////////
    // METHODS //
    /////////////


    /**
     * Constructor.
     * @param {NgbActiveModal} modal
     * @param {ImageProcessingService} imageProcessingService
     */
    constructor(public modal: NgbActiveModal, private imageProcessingService: ImageProcessingService) {}

    /**
     * NgOnInit.
     */
    ngOnInit() {}

    /**
     * NgAfterViewInit.
     */
    ngAfterViewInit() {

        this.filterRealCanvasImage = new CanvasImage(this.filterRealCanvas, this.imageSize);
        this.filterImagCanvasImage = new CanvasImage(this.filterImagCanvas, this.imageSize);

        this.calculateFilter();

    }

    /**
     * Calculates the filter and saves it to the canvas.
     */
    calculateFilter() {

        this.imageProcessingService.normalizedFilter2(
            this.imageSize,
            this.xi,
            this.sigma,
            this.lambda,
            (-2 * Math.PI * this.theta / 360),
            (gReal: Float32Array, gImag: Float32Array, event: MessageEvent) => {
                this.filterRealCanvasImage.setColorScalePixels(<any> gReal);
                this.filterImagCanvasImage.setColorScalePixels(<any> gImag);
            },
            (event: ErrorEvent) => {
                console.error(event);
            }
        );

    }

}
