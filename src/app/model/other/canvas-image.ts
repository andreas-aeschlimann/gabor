import {ElementRef} from "@angular/core";
import {Observable} from "rxjs";

export class CanvasImage {

    /**
     * Canvas context
     */
    public context: CanvasRenderingContext2D;

    /**
     * Canvas size
     * @type {number}
     * @private
     */
    private _size: number = 1024;

    /**
     * Get the canvas size
     * @returns {number}
     */
    get size(): number {
        return this._size;
    }

    /**
     * Set the canvas size
     * @param {number} size
     */
    set size(size: number) {
        if (size > 0 && size <= 4096 && Math.log2(size) % 1 === 0) {
            this._size = size;
        } else {
            console.error(JSON.stringify(size) + " is not a valid size for the canvas.");
        }
    }

    /**
     * Constructor.
     * @param {ElementRef} canvas
     * @param {number} size
     */
    constructor(public canvas: ElementRef, size: number) {
        this.context = (<HTMLCanvasElement> canvas.nativeElement).getContext("2d");
        this.size = size;
    }

    /**
     * Sets the image source.
     * @param {string} url
     * @returns {Observable<boolean>}
     */
    setImageSource(url: string): Observable<boolean> {

        const observable: Observable<boolean> = new Observable<boolean>(
            (observer) => {
                const image: HTMLImageElement = new Image();
                image.onload = () => {

                    // Make sure the image is centered and then cropped, if width and height are not equal
                    const ratio: number = image.naturalWidth / image.naturalHeight;
                    if (ratio > 1) {
                        this.context.drawImage(image, - (this.size * ratio - this.size) / 2, 0, this.size * ratio, this.size);
                    } else if (ratio < 1) {
                        this.context.drawImage(image, 0, - (this.size / ratio - this.size) / 2, this.size, this.size / ratio);
                    } else {
                        this.context.drawImage(image, 0, 0, this.size, this.size);
                    }

                    observer.next(true);
                    observer.complete();

                };
                image.src = url;

            }
        );

        return observable;

    }

    /**
     * Converts any image to gray scale.
     */
    toGrayScale() {

        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
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

    /**
     * Gets all pixels.
     * @returns {Uint8ClampedArray}
     */
    getGrayScalePixels(): Uint8ClampedArray {

        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        const imageData = this.context.getImageData(0, 0, width, height);

        return imageData.data.filter((value: number, i: number) => {
            return i % 4 === 0;
        });

    }

    /**
     * Sets all pixels.
     * @param {Uint8ClampedArray} pixels
     * @returns {boolean}
     */
    setGrayScalePixels(pixels: Uint8ClampedArray): boolean {

        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        const imageData = this.context.getImageData(0, 0, width, height);

        if (pixels.length !== width * height) {
            return false;
        }

        const minMax: number[] = this.findMinMax(pixels);
        // const diff: number = minMax[1] - minMax[0];
        const scale: number = 1; // diff > 0 ? 256.0 / diff : 1;

        let j: number = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i: number = (y * 4) * width + x * 4;
                imageData.data[i] = scale * ( pixels[j] - minMax[0] );
                imageData.data[i + 1] = imageData.data[i];
                imageData.data[i + 2] = imageData.data[i];
                j++;
            }
        }

        if (width > 0 && height > 0) {
            this.context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
        }

        return true;

    }

    /**
     * Gets the minimum and maximum value of an array.
     * @param {Uint8ClampedArray} pixels
     * @returns {number[]}
     */
    private findMinMax(pixels: Uint8ClampedArray): number[] {

        let min: number = pixels[0], max: number = pixels[0];

        for (let i = 0, len = pixels.length; i < len; i++) {
            const v = pixels[i];
            min = (v < min) ? v : min;
            max = (v > max) ? v : max;
        }

        return [min, max];

    }

}
