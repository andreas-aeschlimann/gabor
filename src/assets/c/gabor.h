#include <complex.h>

void filter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta);
void normalizedFilter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta);
void translate2(float complex *f, float complex *fShift, int n, int hShift, int vShift);
void mirrorYCoordinate(float complex *f, float complex *f2, int n);