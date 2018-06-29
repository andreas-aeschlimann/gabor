#!/bin/bash

# cd /opt/emsdk/
# source ./emsdk_env.sh

emcc -O3 -s WASM=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']" -s ALLOW_MEMORY_GROWTH=1 -s "EXPORTED_FUNCTIONS=['_malloc', '_free']" -o main.js main.c fourier.c gabor.c
