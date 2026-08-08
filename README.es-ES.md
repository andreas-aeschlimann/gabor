

## FAQ

**¿Qué es esto?**  
Una aplicación web `Angular` escrita en `TypeScript` que demuestra el efecto de los `filtros de Gabor` bidimensionales en imágenes.

**¿Qué la hace especial?**  
Nuestra aplicación web utiliza `WebAssembly` para realizar los cálculos matemáticos directamente en el navegador. ¡Esto significa que podemos realizar análisis de imágenes de alto rendimiento sin necesidad de un backend!

**¿Cómo puedo probarla?**  
La página de demostración pública se encuentra en GitHub Pages: [https://andreas-aeschlimann.github.io/gabor/](https://andreas-aeschlimann.github.io/gabor/) 

## Introducción

Mediante la transformada de Fourier, es posible determinar las frecuencias presentes en todo el dominio espacial. Desafortunadamente, no es posible indicar en qué ubicación aparecen dichas frecuencias. En 1946, el ingeniero eléctrico nacido en Hungría, Dennis Gabor, tuvo la idea de modificar la transformada de Fourier agregando una función de ventana desplazada g dentro de la integral. A partir de estas modificaciones, nació la transformada de Fourier con ventana, también conocida como transformada de Gabor.

Ajustando la ecuación de la transformada de Gabor, podemos derivar una formulación diferente que es una convolución de la función original y otra función. Esta otra función se llama filtro de Gabor (o función de Gabor) y se hizo muy conocida en el análisis de imágenes. Curiosamente, autores como John Daugman sugieren que las células simples en la corteza visual de los cerebros de los mamíferos pueden modelarse mediante filtros de Gabor. En la actualidad, los filtros de Gabor se han utilizado en análisis de imágenes, compresión de imágenes, reconocimiento de objetos, diagnósticos médicos y muchos otros campos.

El autor de esta página web estudió la transformada de Gabor durante su tesis de máster en la Universidad de Basilea. La tesis fue supervisada por el Prof. Dr. Helmut Harbrecht (Instituto de Matemáticas) y el Prof. Dr. Lukas Rosenthaler (Humanidades Digitales). Si bien la tesis se centra principalmente en la parte teórica y la derivación de la transformada de Gabor y los filtros de Gabor, esta aplicación web está pensada como una herramienta simple para aplicar la teoría.

La tesis se puede descargar aquí: [Gabor Transform and Vision](src/assets/docs/GaborTransform.pdf).

## Documentación

Este repositorio contiene implementaciones para el análisis de Fourier y Gabor. El proyecto contiene código fuente en diferentes lenguajes:

### Aplicación web (GUI)

La GUI de la aplicación web se ha construido con Angular 6 y está escrita en TypeScript (JavaScript). Implementamos las partes matemáticas en código C nativo y utilizamos Emscripten para compilar este código a WebAssembly. Para hacer que toda la aplicación sea más reactiva, agregamos Web Workers que son capaces de realizar los cálculos matemáticos en un hilo en segundo plano.

Si desea probar la aplicación web en su computadora, tiene las siguientes opciones:

* Navegue a nuestra versión pública en GitHub Pages: [https://andreas-aeschlimann.github.io/gabor/](https://andreas-aeschlimann.github.io/gabor/).
* Copie el contenido de la carpeta [docs/](docs/) a un servidor web de su elección y abra `index.html` en un navegador.
* Para desarrollo: Clone este repositorio GIT y ejecute el código fuente con `Angular CLI` (se requiere la última versión de `Node.js` y `NPM`). Puede hacerlo ejecutando ``npm install`` seguido de ``ng serve`` en su terminal o herramienta de línea de comandos.

*Nota: En 2018, WebAssembly y Web Workers llevaban solo un año disponibles. Por lo tanto, es necesario utilizar versiones recientes de navegadores para la demostración del filtro de Gabor. Los navegadores compatibles son Google Chrome (incluido Android), Microsoft Edge, Mozilla Firefox, Opera y Apple Safari (incluido iOS). Si tiene problemas, asegúrese de que su navegador esté actualizado.*

### Códigos C (Matemáticas)

Todos los cálculos matemáticos se realizan dentro de los siguientes archivos C:

* [main.c](src/assets/c/main.c): Archivo principal para todas las llamadas a funciones desde JavaScript.
* [fourier.c](src/assets/c/fourier.c): Proporciona métodos relacionados con la transformada de Fourier.
* [gabor.c](src/assets/c/gabor.c): Proporciona métodos relacionados con la transformada de Gabor.

Estos archivos C son llamados desde métodos de JavaScript que se encuentran en archivos independientes. Esto nos permite utilizar estos métodos en Web Workers:

* [Métodos JavaScript](src/assets/js): Archivos JavaScript que se utilizan en Web Workers.

### Códigos MATLAB (Matemáticas)

Hemos creado dos clases MATLAB que ofrecen funcionalidad para el análisis de Fourier y Gabor en una y dos dimensiones. Se pueden encontrar en el repositorio bajo los siguientes enlaces:

* [Fourier.m](src/assets/matlab/Fourier.m): Contiene métodos relacionados con la transformada de Fourier.
* [Gabor.m](src/assets/matlab/Gabor.m): Contiene métodos relacionados con la transformada de Gabor y los filtros de Gabor.

*Nota: Desde 2018, MATLAB ofrece muchos de estos métodos de fábrica. Estos son mucho más rápidos que nuestras propias implementaciones. Por otro lado, nuestras clases están bien documentadas y pueden considerarse con fines educativos.*

## Acerca de

Esta aplicación web fue desarrollada en 2018 por Andreas Aeschlimann, Instituto de Matemáticas, Universidad de Basilea, Suiza.

El código fuente puede usarse libremente y está licenciado bajo MIT.

Contacto: andreas@appvision.ch
