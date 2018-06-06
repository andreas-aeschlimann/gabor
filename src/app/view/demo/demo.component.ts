import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Event, Router} from "@angular/router";
import {CanvasImage} from "../../model/other/canvas-image";

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
