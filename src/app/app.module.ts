import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";

import {ImageProcessingService} from "./model/math/image-processing.service";
import {ProgressService} from "./model/math/progress.service";

import {MathJaxDirective} from "./model/other/math-jax.directive";

import {AppComponent} from "./app.component";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DemoComponent} from "./view/demo/demo.component";
import {DocsComponent} from "./view/docs/docs.component";
import {AboutComponent} from "./view/about/about.component";
import { FilterComponent } from "./view/filter/filter.component";

import {InputSliderComponent} from "./view/input-slider/input-slider.component";

const appRoutes: Routes = [
    {path: "demo", component: DemoComponent},
    {path: "docs", component: DocsComponent},
    {path: "about", component: AboutComponent},
    {path: "*", redirectTo: "/demo"},
    {path: "**", redirectTo: "/demo"}
];

@NgModule({
    declarations: [
        AppComponent,
        DemoComponent,
        DocsComponent,
        AboutComponent,
        MathJaxDirective,
        InputSliderComponent,
        FilterComponent
    ],
    entryComponents: [
        FilterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: false,
                useHash: true
            }
        ),
        NgbModule.forRoot()
    ],
    providers: [ImageProcessingService, ProgressService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
