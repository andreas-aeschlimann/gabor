import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from "./app.component";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { DemoComponent } from "./demo/demo.component";
import { DocsComponent } from "./docs/docs.component";
import { AboutComponent } from "./about/about.component";

//import { MathJaxDirective } from "./math-jax.directive";

const appRoutes: Routes = [
    //{ path: "", component: DemoComponent },
    { path: "demo", component: DemoComponent },
    { path: "docs", component: DocsComponent },
    { path: "about", component: AboutComponent },
    { path: "*", redirectTo: "/demo" },
    { path: "**", component: DemoComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        DemoComponent,
        DocsComponent,
        AboutComponent,
        //MathJaxDirective
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false }
        ),
        NgbModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
