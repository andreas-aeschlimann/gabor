"use strict";

var Module = {
    locateFile: function (s) {
        return '../c/' + s;
    },
    onRuntimeInitialized: function() {
        normalizedFilter2();
    }
};

importScripts("../c/main.js");

var n = 0;
var xi =  0;
var sigma = 0;
var lambda = 0;
var theta = 0;

var onmessage = function(messageEvent) {
    n = messageEvent.data.n;
    xi =  messageEvent.data.xi;
    sigma = messageEvent.data.sigma;
    lambda = messageEvent.data.lambda;
    theta = messageEvent.data.theta;
}

var normalizedFilter2 = function() {

    // Check size
    if (n % 1 !== 0 || Math.log2(n) % 1 !== 0) {
        console.error("Input data length is not power of 2.");
        postMessage({});
        return;
    }

    // Generate float arrays
    var gReal = new Float32Array(n*n); // filter
    var gImag = new Float32Array(n*n); // filter

    // Call c code
    try {
        const buffer1 = Module._malloc(gReal.length * gReal.BYTES_PER_ELEMENT);
        const buffer2 = Module._malloc(gImag.length * gImag.BYTES_PER_ELEMENT);
        Module.HEAPF32.set(gReal, buffer1 >> 2);
        Module.HEAPF32.set(gImag, buffer2 >> 2);

        Module.ccall(
            "normalizedFilter2",
            null,
            ["number", "number", "number", "number", "number", "number", "number"],
            [buffer1, buffer2, n, xi, sigma, lambda, theta]
        );

        gReal = new Float32Array(Module.HEAPF32.buffer, buffer1, gReal.length);
        gImag = new Float32Array(Module.HEAPF32.buffer, buffer2, gImag.length);
        Module._free(buffer1);
        Module._free(buffer2);

    } catch (e) {
        console.error(e);
    }

    postMessage({gReal: Array.from(gReal), gImag: Array.from(gImag)});

}
