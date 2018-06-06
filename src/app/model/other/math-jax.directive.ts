import {Directive, ElementRef, Input, OnChanges} from "@angular/core";

//import { MathJax } from "mathjax";

//import "mathjax";

@Directive({
    selector: "[appMathJax]"
})
export class MathJaxDirective implements OnChanges {

    @Input("appMathJax") html: string = "";

    constructor(private el: ElementRef) {}

    ngOnChanges() {
        this.el.nativeElement.innerHTML = this.html;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.nativeElement]);
    }
    
}
