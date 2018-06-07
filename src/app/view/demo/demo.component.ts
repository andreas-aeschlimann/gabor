import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Event, Router} from "@angular/router";
import {CanvasImage} from "../../model/other/canvas-image";
import {Gabor} from '../../model/math/gabor';
import {Observable} from 'rxjs';

@Component({
    selector: "app-demo",
    templateUrl: "./demo.component.html",
    styleUrls: ["./demo.component.scss"]
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
    private inputCanvasImage: CanvasImage;

    /**
     * The output canvas image
     */
    private outputCanvasImage: CanvasImage;

    /**
     * Progress bar value
     */
    progressBarValue: number = 100;


    ////////////////
    // IMAGE DATA //
    ////////////////


    /**
     * An image list
     */
    images: any[] = [
        { name: "Domestic cat", url: "assets/images/input/cat.jpg" },
        { name: "Synthetic image", url: "assets/images/input/synthetic.png" },
        { name: "Upload own image", url: "" }
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
        this.inputCanvasImage = new CanvasImage(this.inputCanvas);
        this.outputCanvasImage = new CanvasImage(this.outputCanvas);
        this.saveListedImage(this.image);
    }


    ////////////////////
    // CANVAS METHODS //
    ////////////////////


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

        console.log(event);

        const fileReader: FileReader = new FileReader();
        fileReader.onload = (progressEvent: ProgressEvent) => {
            this.saveImage(this.inputCanvasImage, (<any>progressEvent.target).result);
            this.saveImage(this.outputCanvasImage, (<any>progressEvent.target).result);
        };
        fileReader.readAsDataURL((<any>event).target.files[0]);

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



    convoluteImage_() {
        // Get image pixels of input image
        const pixels: number[] = [1, 2, 3, 2, 1, 2, 3, 4, 5, 2, 7, 3, 8, 2, 5, 8];

        console.log(pixels);
        console.log(this.findMinMax(pixels));

        // Do the convolution
        const newPixels: number[] = Gabor.fgc2(pixels, this.xi, this.sigma, this.lambda, this.theta, this.amount);

        console.log(newPixels);
        console.log(this.findMinMax(newPixels));

    }

    /**
     * Calculates the convolution using the methods from C/WebAssembly code.
     */
    async convoluteImage() {


                // Get image pixels of input image
                let pixels: number[] = Array.from(this.inputCanvasImage.getGrayScalePixels());

                //pixels = pixels.map(v => v/255);

                //console.log(pixels);
                //console.log(this.findMinMax(pixels));

                // Do the convolution
                //console.log((2 * Math.PI * this.theta / 360));
                const newPixels: number[] = await Gabor.fgc2(pixels, this.xi, this.sigma, this.lambda, (-2 * Math.PI * this.theta / 360), this.amount);

                //console.log(this.findMinMax(newPixels));

                // Set image pixels of output image
                this.outputCanvasImage.setGrayScalePixels(new Uint8ClampedArray(newPixels));
;

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
