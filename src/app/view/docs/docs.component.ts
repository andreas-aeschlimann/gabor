import {Component} from "@angular/core";
import {Router} from '@angular/router';

@Component({
    selector: "app-docs",
    templateUrl: "./docs.component.html",
    styleUrls: ["./docs.component.scss"]
})
export class DocsComponent {

    /**
     * Constructor.
     * @param router
     */
    constructor(private router: Router) {}

    /**
     * Opens the about page.
     */
    openAbout() {
        this.router.navigate(["about"]);
    }

}
