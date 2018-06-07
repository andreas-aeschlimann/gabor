#include <complex.h>

void fft1(float complex *y, float complex *yHat, int n);
void ifft1(float complex *yHat, float complex *y, int n);
void conv1(float complex *y1, float complex *y2, float complex *yConv, int n);
void fft2(float complex *y, float complex *yTranspose, int n);
void ifft2(float complex *yHat, float complex *y, int n);
void conv2(float complex *y1, float complex *y2, float complex *yConv, int n);
void conv2Hat(float complex *y1, float complex *y2Hat, float complex *yConv, int n);
