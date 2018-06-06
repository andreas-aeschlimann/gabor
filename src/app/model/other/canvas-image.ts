import { ElementRef } from "@angular/core";
import {Observable} from "rxjs";
//import { Fourier } from "../math/fourier";

export class CanvasImage {

    private context: CanvasRenderingContext2D;

    constructor(private canvas: ElementRef) {
        this.context = (<HTMLCanvasElement> canvas.nativeElement).getContext("2d");
    }

    setImageSource(url: string): Observable<boolean> {

        const observable: Observable<boolean> = new Observable<boolean>(
            (observer) => {
                const image: HTMLImageElement = new Image();
                image.onload = () => {
                    this.context.drawImage(image, 0, 0);
                    observer.next(true);
                    observer.complete();
                };
                image.src = url;

            }
        );

        return observable;

    }

    toGrayScale() {

        const width = this.context.canvas.clientWidth;
        const height = this.context.canvas.clientHeight;
        const imageData = this.context.getImageData(0, 0, width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i: number = (y * 4) * width + x * 4;
                const average: number = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                imageData.data[i] = average;
                imageData.data[i + 1] = average;
                imageData.data[i + 2] = average;
            }
        }

        if (width > 0 && height > 0) {
            this.context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
        }

    }

    fourierTransform() {

        //let pixels: number[][] = [];


        //Fourier.fft2(pixels);

    }



}