"use strict";

var Module = {
    locateFile: function (s) {
        return '../c/' + s;
    },
    onRuntimeInitialized: function() {
        gaborConvolution2();
    }
};

importScripts("../c/main.js");

var f = [];
var xi =  0;
var sigma = 0;
var lambda = 0;
var theta = 0;
var amount = 0;

var onmessage = function(messageEvent) {
    f = messageEvent.data.f;
    xi =  messageEvent.data.xi;
    sigma = messageEvent.data.sigma;
    lambda = messageEvent.data.lambda;
    theta = messageEvent.data.theta;
    amount = messageEvent.data.amount;
}

var gaborConvolution2 = function() {

    // Check size
    if (f.length <= 0) {
        console.error("Input data length is 0.");
        return f;
    }
    const n = Math.sqrt(f.length);
    if (n % 1 !== 0 || Math.log2(n) % 1 !== 0) {
        console.error("Input data length is not power of 2.");
        return f;
    }

    // Generate float arrays
    var fConv = new Float32Array(f.length); // convoluted image

    // Call c code
    try {
        const buffer1 = Module._malloc(f.length * f.BYTES_PER_ELEMENT);
        const buffer2 = Module._malloc(fConv.length * fConv.BYTES_PER_ELEMENT);
        Module.HEAPF32.set(f, buffer1 >> 2);
        Module.HEAPF32.set(fConv, buffer2 >> 2);

        Module.ccall(
            "fgc2",
            null,
            ["number", "number", "number", "number", "number", "number", "number", "number"],
            [buffer1, buffer2, n, xi, sigma, lambda, theta, amount]
        );

        fConv = new Float32Array(Module.HEAPF32.buffer, buffer2, fConv.length);
        Module._free(buffer1);
        Module._free(buffer2);

    } catch (e) {
        console.error(e);
    }

    postMessage({fConv: Array.from(fConv)});

}