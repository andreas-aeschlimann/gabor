#include <stdio.h>
#include <stdlib.h>
#include <complex.h>
#include <math.h>
#include <emscripten/emscripten.h>
#include "fourier.h"
#include "gabor.h"

void _printComplexArray(char *name, float complex z[], int size);
void _printSquareMatrix(char *name, float *z, int size);
void _printComplexSquareMatrix(char *name, float complex *z, int size);

/**
 * Public method that calculates the 1D or 2D fast Fourier transform.
 */
void EMSCRIPTEN_KEEPALIVE fft(float *yReal, float *yImag, int m, int n) {

    printf("Launching C method...\n");

    int size = m;
    if (n > 1) size = m*n;

    // Alloc complex vector
    float complex *y = malloc(size * sizeof(float complex));
    float complex *yHat = malloc(size * sizeof(float complex));

    for (int i = 0; i < size; i++) {
        y[i] = yReal[i] + yImag[i] * I;
    }

    // Do the transform
    if (size == m) _fft1(y, yHat, m);
    else _fft2(y, yHat, m);

    free(y);

    // Save back the data
    for (int i = 0; i < size; i++) {
        yReal[i] = crealf(yHat[i]);
        yImag[i] = cimagf(yHat[i]);
    }

    free(yHat);

    printf("Done!\n");

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
        _conv2(y1C, y2C, yConvC, m);
    } else {
        _conv1(y1C, y2C, yConvC, m);
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
 * Public method that calculates the 2D normalized Gabor filter of given params.
 */
void EMSCRIPTEN_KEEPALIVE normalizedFilter2(float *gReal, float *gImag, int n, float xi, float sigma, float lambda, float theta) {

    printf("Launching C method...\n");

    // Set dimension
    int size = n*n;

    // Alloc data
    float complex *g = malloc(size * sizeof(float complex));

    // Get the filter
    _normalizedFilter2(g, n, xi, sigma, lambda, theta);

    // Assign the real and imag
    for (int i = 0; i < size; i++) {
        gReal[i] = crealf(g[i]);
        gImag[i] = cimagf(g[i]);
    }

    free(g);

    printf("Done!\n");

}

/**
 * Public method that calculates the 2D fast Gabor convolution of an input
 * function and a Gabor filter of given params.
 */
void EMSCRIPTEN_KEEPALIVE fgc2(float *y1, float *yConvSum, int n, float xi, float sigma, float lambda, float theta, int amount) {

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
    float complex *y1Hat = malloc(n * n * sizeof(float complex));
    _fft2(y1C, y1Hat, n);

    free(y1C);

    for (int j = 0; j < amount; j++) {

        // Alloc data
        float complex *y2 = malloc(size * sizeof(float complex));
        float complex *yConv = malloc(size * sizeof(float complex));
        float complex *yConvShifted = malloc(size * sizeof(float complex));

        // Get filter data
        float pi = acos(-1.0);
        _normalizedFilter2(y2, n, xi, sigma, lambda, theta + pi*j/amount);

        _conv2Hat(y2, y1Hat, yConv, n);

        free(y2);

        // Shift the values
        _translate2(yConv, yConvShifted, n, n/2, n/2);

        free(yConv);

        float *yConvShiftedAbs = malloc(size * sizeof(float));

        // Assign real value of data
        for (int i = 0; i < size; i++) {
            yConvShiftedAbs[i] = cabsf(yConvShifted[i]);
            if (j == 0) yConvSum[i] = yConvShiftedAbs[i];
            else yConvSum[i] += yConvShiftedAbs[i];
        }

        free(yConvShifted);
        free(yConvShiftedAbs);

    }

    free(y1Hat);

    printf("Done!\n");

}

///////////////////
// OTHER METHODS //
///////////////////

void _printComplexArray(char *name, float complex *z, int n) {
    printf("%s = \n", name);
    for (int i = 0; i < n; i++) {
        printf("\t%f + %f i", creal(z[i]), cimag(z[i]));
        printf("\n");
    }
    printf("]\n");
}

void _printSquareMatrix(char *name, float *z, int n) {
    printf("%s = \n", name);
    for (int i = 0; i < n; i++) {
        for (int j= 0; j < n; j++) {
            printf("\t%f", z[i*n+j]);
        }
        printf("\n");
    }
    printf("]\n");
}

void _printComplexSquareMatrix(char *name, float complex *z, int n) {
    printf("%s = \n", name);
    for (int i = 0; i < n; i++) {
        for (int j= 0; j < n; j++) {
            printf("\t%f + %f*i", creal(z[i*n+j]), cimag(z[i*n+j]));
        }
        printf("\n");
    }
    printf("]\n");
}