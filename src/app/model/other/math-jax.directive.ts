import {Directive, ElementRef, Input, OnChanges} from "@angular/core";

@Directive({
    selector: "[appMathJax]"
})
export class MathJaxDirective implements OnChanges {

    /**
     * The LaTeX String
     * @type {string}
     */
    @Input("appMathJax") html: string = "";

    /**
     * Constructor.
     * @param {ElementRef} el
     */
    constructor(private el: ElementRef) {}

    /**
     * NgOnChanges.
     */
    ngOnChanges() {
        this.el.nativeElement.innerHTML = this.html;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.nativeElement]);
    }
    
}
