#import <stdio.h>
#import <stdlib.h>
#include <complex.h>
#include <math.h>
#include "gabor.h"

/**
 * Generates a 2D Gabor filter and saves the result into gw.
 */
void filter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta) {

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
void normalizedFilter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta) {

    // Generate the filter
    filter2(gw, n, xi, sigma, lambda, theta);

    // Now normalize the real and imaginary values

    // First, get all sums
    float realSumPos = 0;
    float realSumNeg = 0;
    float imagSumPos = 0;
    float imagSumNeg = 0;
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

    float realPosFact = 0;
    float realNegFact = 0;
    float imagPosFact = 0;
    float imagNegFact = 0;

    if (realSum > 0) {
        realPosFact = realSumPos / realSum;
        realNegFact = realSumNeg / realSum;
    }
    if (imagSum > 0) {
        imagPosFact = imagSumPos / imagSum;
        imagNegFact = imagSumNeg / imagSum;
    }

    // Adjust the values
    for (int y = 0; y < n; y++) {
        for (int x = 0; x < n; x++) {
            float r = crealf(gw[y*n+x]);
            float i = cimagf(gw[y*n+x]);
            if (r > 0) {
                gw[y*n+x] *= realNegFact;
            } else if (r < 0) {
                gw[y*n+x] *= realPosFact;
            }
            if (i > 0) {
                gw[y*n+x] *= imagNegFact;
            } else if (i < 0) {
                gw[y*n+x] *= imagPosFact;
            }
        }
    }

}

/**
 * Translates a 2D complex vector in horizontal and vertical direction.
 */
void translate2(float complex *f, float complex *fShift, int n, int hShift, int vShift) {

    for (int y = 0; y < n; y++) {
        for (int x = 0; x < n; x++) {
            int newInd = ((y+vShift)%n)*n + (x+hShift)%n;
            fShift[newInd] = f[y*n+x];
        }
    }

}
