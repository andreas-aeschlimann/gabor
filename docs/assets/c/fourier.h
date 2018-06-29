#include <complex.h>

void _fft1(float complex *y, float complex *yHat, int n);
void _ifft1(float complex *yHat, float complex *y, int n);
void _conv1(float complex *y1, float complex *y2, float complex *yConv, int n);
void _fft2(float complex *y, float complex *yTranspose, int n);
void _ifft2(float complex *yHat, float complex *y, int n);
void _conv2(float complex *y1, float complex *y2, float complex *yConv, int n);
void _conv2Hat(float complex *y1, float complex *y2Hat, float complex *yConv, int n);
