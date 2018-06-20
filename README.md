## Introduction

This project is a demonstration of two-dimensional Gabor filters that have been studied by the author in the course of his Master's thesis in mathematics at University of Basel.
 
The public demo page may be found at GitHub Pages: [https://andreas-aeschlimann.github.io/gabor/](https://andreas-aeschlimann.github.io/gabor/)

## Summary

Using the Fourier transform, one is able to determine frequencies that are present in the whole spatial domain. Unfortunately, it is not possible to say at which location the frequencies appear. In 1946, the Hungarian-born electrical engineer Dennis Gabor had the idea to modify the Fourier transform by adding a shifted window function g into the integral. From these modifications, the windowed Fourier transform—also known as the Gabor transform—was born.

Adjusting the equation of the Gabor transform, we may derive a different formulation that is a convolution of the original function and some other function. This other function is called Gabor filter (or function) and became well-known in image analysis. Interestingly, authors like John Daugman suggest that simple cells in the visual cortex of mammalian brains can be modeled by Gabor filters. As of today, Gabor filters have been used in image analysis, image compression, object recognition, medical diagnostics, and many more fields.

The author of this web page has studied the Gabor transform in the course of his master thesis at University of Basel. The thesis has been supervised by Prof. Dr. Helmut Harbrecht (Mathematical Institute) and Prof Dr. Lukas Rosenthaler (Digital Humanities). While the thesis is mainly focused on the theoretical part and the derivation of the Gabor transform and Gabor filters, this web application is meant to be a simple tool in order to apply the theory.

The thesis may be downloaded here: [Gabor Transform and Vision](src/assets/docs/GaborTransform.pdf).

## Documentation

This repository contains implementations for Fourier and Gabor analysis. The project is split into different parts:

### Web application

This web application has been built with Angular 6 and is written in TypeScript (JavaScript) and C. We first implemented the whole application in TypeScript, but found the performance to be too weak for its purpose. Because of that, we implemented the mathematical parts in native C code and used Emscripten to compile this code to WebAssembly. In order to make the whole application more reactive, we added Web Workers that are able to make the mathematical calculations in a background thread. The whole source code may be found on GitHub and is available with MIT license.

If you would like to run the web application on your computer, you have two possibilities:

* Copy the contents of the folder [docs/](docs/) to a webserver and open `index.html` in a browser.
* Clone this GIT repository and run the source code with `Angular CLI` (newest version of `NPM`required). You may do that by running ``npm install`` followed by ``ng serve`` in your terminal or command line tool.

### C codes

All mathematical calculations are done within the following C files:

* [main.c](src/assets/c/main.c): Entry file for all function calls from JavaScript.
* [fourier.c](src/assets/c/fourier.c): Provides methods related to the Fourier transform.
* [gabor.c](src/assets/c/gabor.c): Provides methods related to the Gabor transform.

These C files are called from JavaScript methods that are in standalone files. This enables us to use these methods in Web Workers:

* [JavaScript Methods](src/assets/js): JavaScript files that are used in Web Workers.

### Matlab codes

We have created two MATLAB classes that offer functionality for Fourier and Gabor analysis in one and two dimensions. They may be found on the repository under the following links:

* [Fourier.m](src/assets/matlab/Fourier.m): Contains methods related to the Fourier transform.
* [Gabor.m](src/assets/matlab/Gabor.m): Contains methods related to the Gabor transform and Gabor filters.

*Please note: As of 2018, MATLAB offers many of these methods out of the box. Those are much faster than our own implementations. On the other hand, our classes are well-documented and may be considered for educational purposes.*

## About

This web application has been developed in 2018 by Andreas Aeschlimann, Mathematical Institute, University of Basel, Switzerland.

The source code may be freely used and is licensed under MIT.

Contact: a.aeschlimann@unibas.ch