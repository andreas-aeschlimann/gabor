import {ElementRef} from "@angular/core";
import {Observable} from "rxjs";

import * as FileSaver from "file-saver";

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
     * @param {ElementRef} canvasElement
     * @param {number} size
     */
    constructor(public canvasElement: ElementRef, size: number) {
        this.context = (<HTMLCanvasElement> canvasElement.nativeElement).getContext("2d");
        this.context.fillStyle = "#CCC";
        this.context.fillRect(0, 0, size, size);
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
     * Sets all pixels and draws grayscale depending on the pixel values.
     * @param {Uint8ClampedArray} pixels
     * @param {boolean} adjustScale
     * @returns {boolean}
     */
    setGrayScalePixels(pixels: Uint8ClampedArray, adjustScale?: boolean): boolean {

        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        const imageData = this.context.getImageData(0, 0, width, height);

        if (pixels.length !== width * height) {
            return false;
        }

        const minMax: number[] = this.findMinMax(pixels);
        const diff: number = minMax[1] - minMax[0];
        const scale: number = diff > 0 && adjustScale ? 256.0 / diff : 1;

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
     * Draws axes in the canvas.
     */
    drawAxes() {

        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        const imageData = this.context.getImageData(0, 0, width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {

                if (width / 2 !== x && height / 2 !== y) continue;

                const i: number = (y * 4) * width + x * 4;

                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;

            }
        }

        if (width > 0 && height > 0) {
            this.context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
        }

    }

    /**
     * Sets all pixels and draws in color depending on the pixel values.
     * min = blue, max = red
     * @param {Uint8ClampedArray} pixels
     * @returns {boolean}
     */
    setColorScalePixels(pixels: Uint8ClampedArray): boolean {

        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        const imageData = this.context.getImageData(0, 0, width, height);

        if (pixels.length !== width * height) {
            return false;
        }

        const minMax: number[] = this.findMinMax(pixels);
        const z0: number = minMax[0];
        const z1: number = z0 + (minMax[1] - minMax[0]) / 3;
        const z2: number = z0 + 2 * (minMax[1] - minMax[0]) / 3;
        const z3: number = minMax[1];
        console.log(z0);console.log(z3);

        let j: number = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i: number = (y * 4) * width + x * 4;
                const z: number = pixels[j];

                if (z < z1) {
                    imageData.data[i] = 0;
                    imageData.data[i + 1] = Math.max(255 / (z1 - z0) * z - 255 / (z1 - z0) * z0, 0);
                    imageData.data[i + 2] = Math.max(-255 / (z1 - z0) * z - 255 / (z1 - z0) * z0, 0);
                } else if (z < z2) {
                    imageData.data[i] = Math.max(255 / (z2 - z1) * z - 255 / (z2 - z1) * z1, 0);
                    imageData.data[i + 1] = 255;
                    imageData.data[i + 2] = 0;
                } else {
                    imageData.data[i] = 255;
                    imageData.data[i + 1] = Math.max(255 / (z3 - z2) * z - 255 / (z3 - z2) * z3, 0);
                    imageData.data[i + 2] = 0;
                }

                if (j === 0) console.log(imageData.data[i] + "," + imageData.data[i+1] + "," + imageData.data[i+2]);

                j++;
            }
        }

        if (width > 0 && height > 0) {
            this.context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
        }

        return true;

    }

    /**
     * Sets text at a given position.
     * @param {string} text
     * @param {number[]} position
     * @param {number} fontSize
     */
    setText(text: string, position: number [], fontSize: number) {
        this.context.shadowColor = "#000";
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = fontSize / 10;
        this.context.fillStyle = "#FFF";
        this.context.font = ( fontSize * this.size / 1024) + "px Arial";
        this.context.fillText(text, position[0] * this.size / 1024, position[1] * this.size / 1024);
    }

    /**
     * Downloads the whole canvas as an image.
     */
    download() {
        (<HTMLCanvasElement> this.canvasElement.nativeElement).toBlob(
            (blob: Blob) => {
                FileSaver.saveAs(blob, "image.jpg");
            }, "image/jpeg");
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
