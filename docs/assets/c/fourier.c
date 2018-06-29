#import <stdio.h>
#import <stdlib.h>
#include <complex.h>
#include <math.h>
#include "fourier.h"

/**
 * Gets the column of an array representing a matrix.
 */
void _getColumn(float complex *y, float complex *col, int j, int n) {
    for (int i = 0; i < n; i++) {
        col[i] = y[i*n+j];
    }
}

/**
 * Sets the column of an array representing a matrix.
 */
void _setColumn(float complex *y, float complex *col, int j, int n) {
    for (int i = 0; i < n; i++) {
        y[i*n+j] = col[i];
    }
}

/**
 * Gets the row of an array representing a matrix.
 */
void _getRow(float complex *y, float complex *row, int i, int n) {
    for (int j = 0; j < n; j++) {
        row[j] = y[i*n+j];
    }
}

/**
 * Sets the row of an array representing a matrix.
 */
void _setRow(float complex *y, float complex *row, int i, int n) {
    for (int j = 0; j < n; j++) {
        y[i*n+j] = row[j];
    }
}

/**
 * Calculates the 1D fast Fourier transform of an array.
 */
void _fft1(float complex *y, float complex *yHat, int n) {

    // Check if number is > 1 and power of 2
    if (n < 2 || (n & (n-1))) {
        printf("Error in FFT: Input vector must be of size n.\n");
        return;
    }

    // Return if number is 2
    if (n == 2) {
        yHat[0] = y[0]+y[1];
        yHat[1] = y[0]-y[1];
        return;
    }

    // Halve the value of n
    n = n/2;

    // Setup even and odd arrays
    float complex *yEven = malloc(n * sizeof(float complex));
    float complex *yOdd = malloc(n * sizeof(float complex));
    for (int i = 0; i < n; i++) {
        yEven[i] = y[2*i];
        yOdd[i] = y[2*i+1];
    }

    // Calculate c, d
    float complex *c = malloc(n * sizeof(float complex));
    _fft1(yEven, c, n);
    free(yEven);

    float complex *d = malloc(n * sizeof(float complex));
    _fft1(yOdd, d, n);
    free(yOdd);

    // Correct d value
    float pi = acos(-1.0);
    for (int i = 0; i < n; i++) {
        d[i] = cexp(-1.0*I*pi*i/n)*d[i];
    }

    // Combine the values again
    for (int i = 0; i < 2*n; i++) {
        if (i < n) {
            yHat[i] = c[i]+d[i];
        } else {
            yHat[i] = c[i-n]-d[i-n];
        }
    }
    free(c);
    free(d);

}

/**
 * Calculates the 1D inverse fast Fourier transform of an array.
 */
void _ifft1(float complex *yHat, float complex *y, int n) {

    // Conjugate the whole array
    for (int i = 0; i < n; i++) {
        yHat[i] = conjf(yHat[i]);
    }

    // Calculate the FFT
    _fft1(yHat, y, n);

    // Conjugate the result
    float h = 1.0/n;
    for (int i = 0; i < n; i++) {
        y[i] = h * conjf(y[i]);
    }

}


/**
 * Calculates the 1D convolution of two arrays.
 */
void _conv1(float complex *y1, float complex *y2, float complex *yConv, int n) {

    // Calculate the FFT of both vectors
    float complex *y1Hat = malloc(n * sizeof(float complex));
    float complex *y2Hat = malloc(n * sizeof(float complex));

    _fft1(y1, y1Hat, n);
    _fft1(y2, y2Hat, n);

    // Multiply in FFT space
    float complex *yConvHat = malloc(n * sizeof(float complex));
    for (int i = 0; i < n; i++) {
        yConvHat[i] = y1Hat[i] * y2Hat[i];
    }

    free(y1Hat);
    free(y2Hat);

    // Transform back
    _ifft1(yConvHat, yConv, n);

    free(yConvHat);

}

/**
 * Calculates the 2D fast Fourier transform of an array representing a matrix.
 */
void _fft2(float complex *y, float complex *yHat, int n) {

    // Check if number is > 1 and power of 2
    if (n < 2 || (n & (n-1))) {
        printf("Error in FFT: Input matrix must be of size n*n.\n");
        return;
    }

    // Go through each row
    float complex *yHatTemp = malloc(n * n * sizeof(float complex));
    for (int k = 0; k < n; k++) {
        float complex *t = malloc(n * sizeof(float complex));
        float complex *tHat = malloc(n * sizeof(float complex));
        _getRow(y, t, k, n);
        _fft1(&t[0], tHat, n);
        free(t);
        _setRow(yHatTemp, tHat, k, n);
        free(tHat);
    }

    // Go through each col now
    for (int k = 0; k < n; k++) {
        float complex *t = malloc(n * sizeof(float complex));
        float complex *tHat = malloc(n * sizeof(float complex));
        _getColumn(yHatTemp, t, k, n);
        _fft1(t, tHat, n);
        free(t);
        _setColumn(yHat, tHat, k, n);
        free(tHat);
    }
    free(yHatTemp);

}

/**
 * Calculates the 2D inverse fast Fourier transform of an array representing a matrix.
 */
void _ifft2(float complex *yHat, float complex *y, int n) {

    // Conjugate the whole array
    for (int i = 0; i < n*n; i++) {
        yHat[i] = conjf(yHat[i]);
    }

    // Calculate the FFT
    _fft2(yHat, y, n);

    // Conjugate the result
    float h = 1.0/(n*n);
    for (int i = 0; i < n*n; i++) {
        y[i] = h * conjf(y[i]);
    }

}

/**
 * Calculates the 2D convolution of two arrays representing a matrix.
 */
void _conv2(float complex *y1, float complex *y2, float complex *yConv, int n) {

    // Calculate the FFT of both vectors
    float complex *y1Hat = malloc(n * n * sizeof(float complex));
    float complex *y2Hat = malloc(n * n * sizeof(float complex));

    _fft2(y1, y1Hat, n);
    _fft2(y2, y2Hat, n);

    // Multiply in FFT space
    float complex *yConvHat = malloc(n * n * sizeof(float complex));
    for (int i = 0; i < n*n; i++) {
        yConvHat[i] = y1Hat[i] * y2Hat[i];
    }

    free(y1Hat);
    free(y2Hat);

    // Transform back
    _ifft2(yConvHat, yConv, n);

    free(yConvHat);

}

/**
 * Calculates the 2D convolution of two arrays representing a matrix,
 * where the second array already is in Fourier space.
 */
void _conv2Hat(float complex *y1, float complex *y2Hat, float complex *yConv, int n) {

    // Calculate the FFT of the first vector
    float complex *y1Hat = malloc(n * n * sizeof(float complex));

    _fft2(y1, y1Hat, n);

    // Multiply in FFT space
    float complex *yConvHat = malloc(n * n * sizeof(float complex));
    for (int i = 0; i < n*n; i++) {
        yConvHat[i] = y1Hat[i] * y2Hat[i];
    }

    free(y1Hat);

    // Transform back
    _ifft2(yConvHat, yConv, n);

    free(yConvHat);

}
