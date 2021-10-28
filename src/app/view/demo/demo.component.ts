import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Event, Router} from "@angular/router";
import {interval, Subscription} from "rxjs";

import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {ImageProcessingService} from "../../model/math/image-processing.service";
import {ProgressService} from "../../model/math/progress.service";

import {CanvasImage} from "../../model/other/canvas-image";
import {FilterComponent} from "../filter/filter.component";

@Component({
    selector: "app-demo",
    templateUrl: "./demo.component.html",
    styleUrls: ["./demo.component.scss"],
    providers: []
})
export class DemoComponent implements OnInit, AfterViewInit, OnDestroy {

    ///////////////////
    // FILTER PARAMS //
    ///////////////////


    /**
     * Gabor filter parameter for the dilation in x or y
     *
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

    /**
     * Gabor filter parameter for the amount of rotates considered
     * @type {number}
     */
    amount: number = 1;


    /////////////////
    // CANVAS DATA //
    /////////////////


    /**
     * Input canvas html element
     * @type {ElementRef}
     */
    @ViewChild("inputCanvas", { static: true }) inputCanvas: ElementRef;

    /**
     * Output canvas html element
     * @type {ElementRef}
     */
    @ViewChild("outputCanvas", { static: true }) outputCanvas: ElementRef;

    /**
     * The input canvas image
     * @type {CanvasImage}
     */
    inputCanvasImage: CanvasImage;

    /**
     * The output canvas image
     * @type {CanvasImage}
     */
    outputCanvasImage: CanvasImage;

    /**
     * The default pixel size of the canvas
     * @type {number}
     */
    imageSize: number = 1024;


    ////////////////
    // IMAGE DATA //
    ////////////////


    /**
     * An image list
     */
    images: any[] = [
        {name: "Church St. Margarethen", url: "assets/images/input/church.jpg"},
        {name: "Domestic cat \"Flöckli\"", url: "assets/images/input/cat.jpg"},
        {name: "Lamp", url: "assets/images/input/lamp.png"},
        {name: "Lena", url: "assets/images/input/lena.jpg"},
        {name: "Motorcycle", url: "assets/images/input/motorcycle.jpg"},
        {name: "Synthetic image", url: "assets/images/input/synthetic.png"},
        {name: "USS Enterprise NCC-1701", url: "assets/images/input/enterprise.png"},
        {name: "----------", url: "", disabled: true},
        {name: "Upload own image", url: ""}
    ];

    /**
     * The selected image
     */
    image: any;

    /**
     * The selected file
     */
    file: File;


    ///////////
    // OTHER //
    ///////////


    /**
     * The modal
     * @type {NgbModalRef}
     */
    @ViewChild("filterModal", { static: false }) filterModal: NgbModalRef;

    /**
     * An estimate of the average calculation time based on 1024 image
     * @type {number}
     */
    private calculationDurationEstimates: number = 3000;


    //////////////////
    // CONSTRUCTORS //
    //////////////////


    /**
     * Constructor.
     * @param {Router} router
     * @param {NgbModal} modalService
     * @param {ImageProcessingService} imageProcessingService
     * @param {ProgressService} progressService
     */
    constructor(private router: Router,
                private modalService: NgbModal,
                private imageProcessingService: ImageProcessingService,
                public progressService: ProgressService) {
        this.image = this.images[1];
        this.progressService.percentage = 0;
    }

    /**
     * NgOnInit.
     */
    ngOnInit() {}

    /**
     * NgAfterViewInit.
     */
    ngAfterViewInit() {
        this.inputCanvasImage = new CanvasImage(this.inputCanvas, this.imageSize);
        this.outputCanvasImage = new CanvasImage(this.outputCanvas, this.imageSize);
        this.saveListedImage(this.image);
    }

    /**
     * NgOnDestroy.
     */
    ngOnDestroy() {
        this.progressService.percentage = 0;
    }


    ////////////////////
    // CANVAS METHODS //
    ////////////////////


    /**
     * Adjusts the image size of both canvases.
     * @param {number} imageSize in pixel
     */
    adjustImageSize(imageSize: number) {
        this.inputCanvasImage.size = imageSize;
        this.outputCanvasImage.size = imageSize;
        this.saveListedImage(this.image);
    }


    /**
     * Saves an image from the list to the canvas.
     * @param image
     */
    saveListedImage(image: any) {

        if (image === undefined || image.url === "") {
            this.saveUploadedFile(this.file);
            return;
        }

        this.saveImage(this.inputCanvasImage, image.url);
        this.saveImage(this.outputCanvasImage, image.url);

    }

    /**
     * Prepares a selected file to save it to the canvas.
     * @param {Event} event
     */
    onInputFileChanged(event: Event) {

        try {
            if ((<any>event).target.files.length === 0) return;
            this.saveUploadedFile((<any>event).target.files[0]);
        } catch (e) {
            console.error(e);
            this.file = null;
        }

    }

    /**
     * Saves a file to the canvas.
     * @param {File} file
     */
    saveUploadedFile(file: File) {

        try {

            if (file instanceof File === false) return;

            const fileReader: FileReader = new FileReader();
            fileReader.onload = (progressEvent: ProgressEvent) => {
                this.saveImage(this.inputCanvasImage, (<any>progressEvent.target).result);
                this.saveImage(this.outputCanvasImage, (<any>progressEvent.target).result);
            };
            fileReader.readAsDataURL(file);

            this.file = file;

        } catch (e) {
            console.error(e);
            this.file = null;
        }

    }

    /**
     * Saves an image by the url to a canvas image object.
     * @param {CanvasImage} canvasImage
     * @param {string} url
     */
    private saveImage(canvasImage: CanvasImage, url: string) {

        canvasImage.setImageSource(url).subscribe(
            (success: boolean) => {
                canvasImage.toGrayScale();
            },
            (error: any) => {
                console.error(error);
            }
        );

    }


    //////////////////
    // MATH METHODS //
    //////////////////


    /**
     * Shows the filter in a modal.
     */
    showFilter() {

        const modal: NgbModalRef = this.modalService.open(FilterComponent, { size: "lg" });
        const filterComponent: FilterComponent = modal.componentInstance;

        // Pass the filter data
        filterComponent.xi = this.xi;
        filterComponent.sigma = this.sigma;
        filterComponent.lambda = this.lambda;
        filterComponent.theta = this.theta;
        filterComponent.imageSize = this.imageSize;

    }


    /**
     * Calculates the convolution using the methods from C/WebAssembly code.
     */
    convoluteImage() {

        // Reset progress
        this.progressService.percentage = 5;

        // Get image pixels of input image
        const pixels: Float32Array = new Float32Array(this.inputCanvasImage.getGrayScalePixels());

        // Estimate the calculation time
        const l: number = this.calculationDurationEstimates;
        const subscription: Subscription = interval(this.amount * l * pixels.length / ( 1024 * 1024 ) / 45).subscribe(
            _ => { this.progressService.percentage += 2; }
        );

        this.imageProcessingService.gaborConvolution2(
            pixels,
            this.xi,
            this.sigma,
            this.lambda,
            (-2 * Math.PI * this.theta / 360),
            this.amount,
            (fConv: Float32Array, event: MessageEvent) => {
                // console.log(event.data.fConv);
                subscription.unsubscribe();
                this.outputCanvasImage.setGrayScalePixels(<any> fConv);
                this.progressService.percentage = 100;
            },
            (event: ErrorEvent) => {
                console.error(event);
                subscription.unsubscribe();
                this.progressService.percentage = 100;
            }
        );

    }


    ///////////////////
    // OTHER METHODS //
    ///////////////////


    /**
     * Opens the docs page.
     */
    openDocs() {
        this.router.navigate(["docs"]);
    }

}
