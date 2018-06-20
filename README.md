## Introduction

This project is a demonstration of two-dimensional Gabor filters that have been studied by the author in the course of his Master's thesis in mathematics at University of Basel.
 
The public demo page may be found at GitHub Pages: [https://andreas-aeschlimann.github.io/gabor/](https://andreas-aeschlimann.github.io/gabor/)

## Documentation

This repository contains implementations for Fourier and Gabor analysis. The project is split into different parts:

### Web application (GUI)

This web application has been built with Angular 6 and is written in TypeScript (JavaScript) and C. We first implemented the whole application in TypeScript, but found the performance to be too weak for its purpose. Because of that, we implemented the mathematical parts in native C code and used Emscripten to compile this code to WebAssembly. In order to make the whole application more reactive, we added Web Workers that are able to make the mathematical calculations in a background thread. The whole source code may be found on GitHub and is available with MIT license.

If you would like to run the web application on your computer, you have the following possibilities:

* Navigate to our public GitHub Pages release: [https://andreas-aeschlimann.github.io/gabor/](https://andreas-aeschlimann.github.io/gabor/).
* Copy the contents of the folder [docs/](docs/) to your webserver and open `index.html` in a browser.
* For development: Clone this GIT repository and run the source code with `Angular CLI` (newest version of `Node.js` and `NPM`required). You may do that by running ``npm install`` followed by ``ng serve`` in your terminal or command line tool.

### C codes (Mathematics)

All mathematical calculations are done within the following C files:

* [main.c](src/assets/c/main.c): Entry file for all function calls from JavaScript.
* [fourier.c](src/assets/c/fourier.c): Provides methods related to the Fourier transform.
* [gabor.c](src/assets/c/gabor.c): Provides methods related to the Gabor transform.

These C files are called from JavaScript methods that are in standalone files. This enables us to use these methods in Web Workers:

* [JavaScript Methods](src/assets/js): JavaScript files that are used in Web Workers.

### Matlab codes (Mathematics)

We have created two MATLAB classes that offer functionality for Fourier and Gabor analysis in one and two dimensions. They may be found on the repository under the following links:

* [Fourier.m](src/assets/matlab/Fourier.m): Contains methods related to the Fourier transform.
* [Gabor.m](src/assets/matlab/Gabor.m): Contains methods related to the Gabor transform and Gabor filters.

*Please note: As of 2018, MATLAB offers many of these methods out of the box. Those are much faster than our own implementations. On the other hand, our classes are well-documented and may be considered for educational purposes.*

## About

This web application has been developed in 2018 by Andreas Aeschlimann, Mathematical Institute, University of Basel, Switzerland.

The source code may be freely used and is licensed under MIT.

Contact: a.aeschlimann@unibas.ch