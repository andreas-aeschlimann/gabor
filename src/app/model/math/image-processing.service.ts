import {Injectable} from "@angular/core";

@Injectable()
export class ImageProcessingService {

    /**
     * Constructor.
     */
    constructor() {}

    async normalizedFilter2(n: number,
                            xi: number,
                            sigma: number,
                            lambda: number,
                            theta: number,
                            successCallback: (event: MessageEvent) => void,
                            errorCallback: (event: ErrorEvent) => void) {

        // Create a new worker
        const backgroundWorker: Worker = new Worker("assets/js/normalizedFilter2.js");

        // The success callback
        backgroundWorker.onmessage = (event: MessageEvent) => {
            backgroundWorker.terminate();
            successCallback(event);
        };

        // The error callback
        backgroundWorker.onerror = (event: ErrorEvent) => {
            backgroundWorker.terminate();
            errorCallback(event);
        };

        // Post the data
        backgroundWorker.postMessage({n: n, xi: xi, sigma: sigma, lambda: lambda, theta: theta});

    }

    /**
     * Does a Gabor convolution, that is an input image is convoluted by a Gabor filter with given params.
     * @param {Float32Array} f input image data in grayscale
     * @param {number} xi parameter of Gabor filter
     * @param {number} sigma parameter of Gabor filter
     * @param {number} lambda parameter of Gabor filter
     * @param {number} theta parameter of Gabor filter
     * @param {number} amount parameter of Gabor filter
     * @param {(event: MessageEvent) => void} successCallback fired on success
     * @param {(event: ErrorEvent) => void} errorCallback fired on error
     */
    async gaborConvolution2(f: Float32Array,
                           xi: number,
                           sigma: number,
                           lambda: number,
                           theta: number,
                           amount: number,
                           successCallback: (event: MessageEvent) => void,
                           errorCallback: (event: ErrorEvent) => void) {

        // Create a new worker
        const backgroundWorker: Worker = new Worker("assets/js/gaborConvolution2.js");

        // The success callback
        backgroundWorker.onmessage = (event: MessageEvent) => {
            backgroundWorker.terminate();
            successCallback(event);
        };

        // The error callback
        backgroundWorker.onerror = (event: ErrorEvent) => {
            backgroundWorker.terminate();
            errorCallback(event);
        };

        // Post the data
        backgroundWorker.postMessage({f: f, xi: xi, sigma: sigma, lambda: lambda, theta: theta, amount: amount});

    }

}
