import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ImageProcessingService} from './model/math/image-processing.service';
import {ProgressService} from './model/math/progress.service';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {

    /**
     * Determines whether the nav bar is collapsed or not
     */
    collapsed: boolean = true;

    /**
     * Constructor.
     * @param {Router} router
     * @param {ProgressService} progressService
     */
    constructor(private router: Router, public progressService: ProgressService) {}

    /**
     * Opens an internal page
     * @param {string} url
     */
    openPage(url: string) {
        this.collapsed = true;
        this.router.navigate(["/" + url]);
    }

}
