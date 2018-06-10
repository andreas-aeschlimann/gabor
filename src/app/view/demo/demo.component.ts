import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Event, Router} from "@angular/router";
import {CanvasImage} from "../../model/other/canvas-image";
import {Gabor} from "../../model/math/gabor";
import {interval, Observable, Subscription, timer} from 'rxjs';
declare var Module: any;

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
    lambda: number = 2;

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
     * The input canvas image
     */
    inputCanvasImage: CanvasImage;

    /**
     * The output canvas image
     */
    outputCanvasImage: CanvasImage;

    /**
     * The size of the canvas
     */
    imageSize: number = 1024;

    /**
     * Progress bar value
     */
    progressBarValue: number = 100;

    /**
     * Background worker for the math
     */
    backgroundWorker: Worker;



    ////////////////
    // IMAGE DATA //
    ////////////////


    /**
     * An image list
     */
    images: any[] = [
        {name: "Domestic cat \"Flöckli\"", url: "assets/images/input/cat.jpg"},
        {name: "USS Enterprise NCC-1701", url: "assets/images/input/enterprise.png"},
        {name: "Lamp", url: "assets/images/input/lamp.png"},
        {name: "Lena", url: "assets/images/input/lena.jpg"},
        {name: "Synthetic image", url: "assets/images/input/synthetic.png"},
        {name: "Upload own image", url: ""}
    ];

    /**
     * The selected image
     */
    image: any;


    //////////////////
    // CONSTRUCTORS //
    //////////////////


    /**
     * Constructor.
     * @param router
     */
    constructor(private router: Router) {
        this.image = this.images[0];
    }

    /**
     * NgOnInit.
     */
    ngOnInit() {
        this.inputCanvasImage = new CanvasImage(this.inputCanvas, 1024);
        this.outputCanvasImage = new CanvasImage(this.outputCanvas, 1024);
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
     * Calculates the convolution using the methods from C/WebAssembly code.
     */
    convoluteImage() {

/*
        this.backgroundWorker = new Worker("assets/js/test.js");

        const pixels = new Float32Array([0, 1, 2, 4, 8, 1, 4, 2, 3, 9, 1, 2, 9, 2, 4, 0]);
        console.log(pixels);

        this.backgroundWorker.onmessage = (event) => {
            console.log(event.data);
            this.backgroundWorker.terminate();
        };
        this.backgroundWorker.onerror = (event) => {
            console.error(event);
            this.backgroundWorker.terminate();
        };

        this.backgroundWorker.postMessage({ f: pixels, xi: this.xi, sigma: this.sigma, lambda: this.lambda, theta: (2 * Math.PI * this.theta / 360), amount: this.amount });

*/


        this.progressBarValue = 0;

        // Get image pixels of input image
        const pixels: Float32Array = new Float32Array(this.inputCanvasImage.getGrayScalePixels());

        //pixels = pixels.map(v => v/255);

        //console.log(pixels);
        //console.log(this.findMinMax(pixels));

        // Do the convolution
        //console.log((2 * Math.PI * this.theta / 360));

        this.progressBarValue = 5;

        this.backgroundWorker = new Worker("assets/js/test.js");


        /**
         * Calculated time to spend:
         * 1024: amount * 3s
         */
        const subscription: Subscription = interval(1000 * 4 * (this.imageSize/1024)*(this.imageSize/1024) * this.amount / 30).subscribe(
            _ => {
                this.progressBarValue += 3;
            }
        );

        //console.log(pixels);
        //console.log(this.findMinMax(pixels));

        this.backgroundWorker.onmessage = (event) => {
            subscription.unsubscribe();
            //console.log(event.data);
            const newPixels: Uint8ClampedArray = new Uint8ClampedArray(event.data);
            this.progressBarValue = 95;
            this.outputCanvasImage.setGrayScalePixels(newPixels);
            this.backgroundWorker.terminate();
            this.progressBarValue = 100;
            //console.log(this.findMinMax(event.data));
        };
        this.backgroundWorker.onerror = (event) => {
            subscription.unsubscribe();
            console.error(event);
            this.backgroundWorker.terminate();
            this.progressBarValue = 100;
        };

        this.backgroundWorker.postMessage({ f: pixels, xi: this.xi, sigma: this.sigma, lambda: this.lambda, theta: (-2 * Math.PI * this.theta / 360), amount: this.amount });

    }


    findMinMax(arr) {
        let min = arr[0], max = arr[0];

        for (let i = 0, len = arr.length; i < len; i++) {
            const v = arr[i];
            min = (v < min) ? v : min;
            max = (v > max) ? v : max;
        }

        return [min, max];

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
