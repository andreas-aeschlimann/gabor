#include <complex.h>
#include <emscripten/emscripten.h>

void _filter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta);
void _normalizedFilter2(float complex *gw, int n, float xi, float sigma, float lambda, float theta);
void _translate2(float complex *f, float complex *fShift, int n, int hShift, int vShift);
void _mirrorYCoordinate(float complex *f, float complex *f2, int n);
