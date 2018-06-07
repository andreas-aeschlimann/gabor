#include <stdio.h>
#include <stdlib.h>
#include <complex.h>
#include <math.h>
#include <emscripten/emscripten.h>
#include "fourier.h"
#include "gabor.h"

void EMSCRIPTEN_KEEPALIVE fft(float *yReal, float *yImag, int m, int n);
void EMSCRIPTEN_KEEPALIVE ifft(float *yReal, float *yImag, int m, int n);
void _fft1(float *yReal, float *yImag, int n);
void _fft2(float *yReal, float *yImag, int m, int n);

/**
 * Public method that calculates the 1D or 2D fast Fourier transform.
 */
void EMSCRIPTEN_KEEPALIVE fft(float *yReal, float *yImag, int m, int n) {

    printf("FFT Method\n");

    printf("%i x %i\n", m, n);

    if (n > 1) {
        printf("2d case\n");
         _fft2(yReal, yImag, m, n);
    } else {
        printf("1d case\n");
        _fft1(yReal, yImag, m);
    }

}

/**
 * Public method that calculates the 1D or 2D inverse fast Fourier transform.
 */
void EMSCRIPTEN_KEEPALIVE ifft(float *yReal, float *yImag, int m, int n) {

    printf("IFFT Method\n");

    printf("%i x %i\n", m, n);

    if (n > 1) {
        printf("2d case\n");
         _fft2(yReal, yImag, m, n);
    } else {
        printf("1d case\n");
        _fft1(yReal, yImag, m);
    }

}

/**
 * Public method that calculates the 1D or 2D convolution.
 */
void EMSCRIPTEN_KEEPALIVE conv(float *y1, float *y2, float *yConv, int m, int n) {

    printf("Launching C method...\n");

    // Set dimension
    int size = m*n;

    // Alloc data
    float complex *y1C = malloc(size * sizeof(float complex));
    float complex *y2C = malloc(size * sizeof(float complex));
    float complex *yConvC = malloc(size * sizeof(float complex));

    // Assign real value of data
    for (int i = 0; i < size; i++) {
        y1C[i] = y1[i];
        y2C[i] = y2[i];
    }

    // Do the convolution
    if (n > 1) {
        conv2(y1C, y2C, yConvC, m);
    } else {
        printf("1d case\n");
        conv1(y1C, y2C, yConvC, m);
    }

    free(y1C);
    free(y2C);

    // Assign real value of data
    for (int i = 0; i < size; i++) {
        yConv[i] = crealf(yConvC[i]);
    }

    free(yConvC);

    printf("Done!\n");

}

/**
 * Public method that calculates the 2D fast Gabor convolution of an input
 * function and a Gabor filter of given params.
 */
void EMSCRIPTEN_KEEPALIVE fgc2(float *y1, float *yConv, int n, float xi, float sigma, float lambda, float theta, int amount) {

    printf("Launching C method...\n");

    // Set dimension
    int size = n*n;

    // Alloc data
    float complex *y1C = malloc(size * sizeof(float complex));

    // Assign real value of data
    for (int i = 0; i < size; i++) {
        y1C[i] = y1[i];
    }

    // Calculate Fourier transform of y1C First
    float complex *y1CHat = malloc(n * n * sizeof(float complex));
    fft2(y1C, y1CHat, n);

    free(y1C);

    for (int j = 0; j < amount; j++) {

        // Alloc data
        float complex *y2C = malloc(size * sizeof(float complex));
        float complex *yConvC = malloc(size * sizeof(float complex));
        float complex *yConvCShifted = malloc(size * sizeof(float complex));

        // Get filter data
        float pi = acos(-1.0);
        normalizedFilter2(y2C, n, xi, sigma, lambda, theta + pi*j/amount);

        // Do the convolution
        conv2Hat(y2C, y1CHat, yConvC, n);

        free(y1CHat);
        free(y2C);

        // Shift the values
        translate2(yConvC, yConvCShifted, n, n/2, n/2);

        free(yConvC);

        // Assign real value of data
        for (int i = 0; i < size; i++) {
            if (j == 0) yConv[i] = cabsf(yConvCShifted[i]);
            else yConv[i] += cabsf(yConvCShifted[i]);
        }

        free(yConvCShifted);

    }

    printf("Done!\n");

}

void _fft1(float *yReal, float *yImag, int n) {

    // Alloc complex vector
    float complex *y = malloc(n * sizeof(float complex));
    float complex *yHat = malloc(n * sizeof(float complex));

    for (int i = 0; i < n; i++) {
        y[i] = yReal[i] + yImag[i] * I;
    }

    // Do the transform
    fft1(y, yHat, n);

    free(y);

    // Save back the data
    for (int i = 0; i < n; i++) {
        yReal[i] = crealf(yHat[i]);
        yImag[i] = cimagf(yHat[i]);
    }

    free(yHat);

}

void _fft2(float *yReal, float *yImag, int m, int n) {

    // Alloc complex matrix
    float complex *y = malloc(n * n * sizeof(float complex));
    float complex *yHat = malloc(n * n * sizeof(float complex));

    for (int i = 0; i < m*n; i++) {
        y[i] = yReal[i] + yImag[i] * I;
    }

    // Do the transform
    fft2(y, yHat, n);

    free(y);

    // Save back the data
    for (int i = 0; i < m*n; i++) {
        yReal[i] = crealf(yHat[i]);
        yImag[i] = cimagf(yHat[i]);
    }

    free(yHat);

}
