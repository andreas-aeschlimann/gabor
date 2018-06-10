import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Event, Router} from "@angular/router";
import {interval, Subscription} from "rxjs";

import {ImageProcessingService} from "../../model/math/image-processing.service";

import {CanvasImage} from "../../model/other/canvas-image";
import {ProgressService} from '../../model/math/progress.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: "app-demo",
    templateUrl: "./demo.component.html",
    styleUrls: ["./demo.component.scss"],
    providers: []
})
export class DemoComponent implements OnInit {

    ///////////////////
    // FILTER PARAMS //
    ///////////////////


    /**
     * Gabor filter parameter for the dilation in x or y
     */
    xi: number = 0.5;

    /**
     * Gabor filter parameter for the width
     */
    sigma: number = 1;

    /**
     * Gabor filter parameter for the wavelength of the sinusoid part
     */
    lambda: number = 4;

    /**
     * Gabor filter parameter for the original angle
     */
    theta: number = 0;

    /**
     * Gabor filter parameter for the amount of rotates considered
     */
    amount: number = 1;


    /////////////////
    // CANVAS DATA //
    /////////////////


    /**
     * Input canvas html element
     */
    @ViewChild("inputCanvas") inputCanvas: ElementRef;

    /**
     * Output canvas html element
     */
    @ViewChild("outputCanvas") outputCanvas: ElementRef;

    /**
     * Filter canvas html element
     */
    @ViewChild("filterRealCanvas") filterRealCanvas: ElementRef;

    /**
     * Filter canvas html element
     */
    @ViewChild("filterImagCanvas") filterImagCanvas: ElementRef;

    /**
     * The input canvas image
     */
    inputCanvasImage: CanvasImage;

    /**
     * The output canvas image
     */
    outputCanvasImage: CanvasImage;

    /**
     * The filter canvas image
     */
    filterRealCanvasImage: CanvasImage;

    /**
     * The filter canvas image
     */
    filterImagCanvasImage: CanvasImage;

    /**
     * The default pixel size of the canvas
     */
    imageSize: number = 1024;



    ////////////////
    // IMAGE DATA //
    ////////////////


    /**
     * An image list
     */
    images: any[] = [
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


    ///////////
    // OTHER //
    ///////////


    /**
     * The modal
     */
    @ViewChild("filterModal") filterModal: NgbModalRef;

    /**
     * An estimate of the average calculation time based on 1024 image
     */
    private calculationDurationEstimates: number = 3000;


    //////////////////
    // CONSTRUCTORS //
    //////////////////


    /**
     * Constructor.
     * @param router
     * @param modalService
     * @param imageProcessingService
     * @param progressService
     */
    constructor(private router: Router,
                private modalService: NgbModal,
                private imageProcessingService: ImageProcessingService,
                public progressService: ProgressService) {
        this.image = this.images[0];
    }

    /**
     * NgOnInit.
     */
    ngOnInit() {
        this.inputCanvasImage = new CanvasImage(this.inputCanvas, this.imageSize);
        this.outputCanvasImage = new CanvasImage(this.outputCanvas, this.imageSize);
        this.saveListedImage(this.image);
    }


    ////////////////////
    // CANVAS METHODS //
    ////////////////////


    /**
     * Adjusts the image size of both canvases.
     * @param imageSize in pixel
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

        if (image === undefined || image.url === "") return;

        this.saveImage(this.inputCanvasImage, image.url);
        this.saveImage(this.outputCanvasImage, image.url);

    }

    /**
     * Saves an uploaded image to the canvas.
     * @param event
     */
    saveUploadedImage(event: Event) {

        try {

            const fileReader: FileReader = new FileReader();
            fileReader.onload = (progressEvent: ProgressEvent) => {
                this.saveImage(this.inputCanvasImage, (<any>progressEvent.target).result);
                this.saveImage(this.outputCanvasImage, (<any>progressEvent.target).result);
            };
            fileReader.readAsDataURL((<any>event).target.files[0]);

        } catch (e) {
            console.error(e);
        }

    }

    /**
     * Saves an image by the url to a canvas image object.
     * @param canvasImage
     * @param url
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

        this.imageProcessingService.normalizedFilter2(
            this.imageSize,
            this.xi,
            this.sigma,
            this.lambda,
            (-2 * Math.PI * this.theta / 360),
            this.amount,
            (event: MessageEvent) => {
                // console.log(event.data.gReal);
                // console.log(event.data.gImag);
                this.filterRealCanvasImage.setGrayScalePixels(event.data.gReal);
                this.filterImagCanvasImage.setGrayScalePixels(event.data.gImag);
            },
            (event: ErrorEvent) => {
                console.error(event);
            }
        );

        this.modalService.open(this.filterModal, { size: "lg" }).result.then(
            _ => {

                this.filterRealCanvasImage = new CanvasImage(this.filterRealCanvas, this.imageSize);
                this.filterImagCanvasImage = new CanvasImage(this.filterImagCanvas, this.imageSize);

            }
        );

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
            (event: MessageEvent) => {
                // console.log(event.data.fConv);
                subscription.unsubscribe();
                this.outputCanvasImage.setGrayScalePixels(event.data.fConv);
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
