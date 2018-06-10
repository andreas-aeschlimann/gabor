#import <stdio.h>
#import <stdlib.h>
#include <complex.h>
#include <math.h>
#include "fourier.h"
#include "gabor.h"

/**
 * Generates a 2D Gabor filter and saves the result into gw.
 */
void _filter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta) {

    float pi = acos(-1.0);

    for (int y = 0; y < n; y++) {
        for (int x = 0; x < n; x++) {
            float xs = + (x-n/2)*cos(theta) + (y-n/2)*sin(theta);
            float ys = - (x-n/2)*sin(theta) + (y-n/2)*cos(theta);
            gw[y*n+x] = cexp(-(xs*xs+xi*xi*ys*ys)/(2*sigma*sigma)) * cexp(2*pi*I*xs/lambda);
        }
    }

}

/**
 * Generates a 2D Gabor filter that is normalized and saves the result into gw.
 */
void _normalizedFilter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta) {

    // Generate the filter
    _filter2(gw, n, xi, sigma, lambda, theta);

    // Now normalize the real and imaginary values

    // First, get all sums
    float realSumPos = 0.0;
    float realSumNeg = 0.0;
    float imagSumPos = 0.0;
    float imagSumNeg = 0.0;
    for (int y = 0; y < n; y++) {
        for (int x = 0; x < n; x++) {
            float r = crealf(gw[y*n+x]);
            float i = cimagf(gw[y*n+x]);
            if (r > 0) {
                realSumPos += r;
            } else if (r < 0) {
                realSumNeg += fabsf(r);
            }
            if (i > 0) {
                imagSumPos += i;
            } else if (i < 0) {
                imagSumNeg += fabsf(i);
            }
        }
    }

    // Now as we have the sum, determine factors
    float realSum = (realSumPos+realSumNeg) / 2.0;
    float imagSum = (imagSumPos+imagSumNeg) / 2.0;

    float realPosFact = 0.0;
    float realNegFact = 0.0;
    float imagPosFact = 0.0;
    float imagNegFact = 0.0;

    if (realSum > 0) {
        realPosFact = realSumPos / realSum;
        realNegFact = realSumNeg / realSum;
    }

    if (imagSumPos > 0 || imagSumNeg > 0) {
        imagPosFact = imagSumPos / imagSum;
        imagNegFact = imagSumNeg / imagSum;
    }

    // Adjust the values
    for (int y = 0; y < n; y++) {
        for (int x = 0; x < n; x++) {

            float r = crealf(gw[y*n+x]);
            float i = cimagf(gw[y*n+x]);

            if (r > 0) {
                r *= realNegFact;
            } else if (r < 0) {
                r *= realPosFact;
            }
            if (i > 0) {
                i *= imagNegFact;
            } else if (i < 0) {
                i *= imagPosFact;
            }

            gw[y*n+x] = r + i*I;

        }
    }

}

/**
 * Fixes the coordinates of an input image by mirroring all y-values
 */
void _mirrorYCoordinate(float complex *f, float complex *f2, int n) {
    //float complex *fTemp = malloc(n * n * sizeof(float complex));
    for (int y = 0; y < n; y++) {
        for (int x = 0; x < n; x++) {
            f2[y*n+x] = f[y*n+(n-1-x)];
            //printf("%f + %f*i", crealf(fTemp[y*n+x]), cimagf(fTemp[y*n+x]));
        }
    }
    //printf("\n%f + %f*i", crealf(f[0]), cimagf(f[0]));
    //printf("%f + %f*i", crealf(fTemp[0]), cimagf(fTemp[0]));

    //printf("%f + %f*i", crealf(f[0]), cimagf(f[0]));

}

/**
 * Translates a 2D complex vector in horizontal and vertical direction.
 */
void _translate2(float complex *f, float complex *fShift, int n, int hShift, int vShift) {

    for (int y = 0; y < n; y++) {
        for (int x = 0; x < n; x++) {
            int newInd = ((y+vShift)%n)*n + (x+hShift)%n;
            fShift[newInd] = f[y*n+x];
        }
    }

}
