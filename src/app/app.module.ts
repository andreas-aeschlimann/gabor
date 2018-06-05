import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from "./app.component";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { DemoComponent } from './demo/demo.component';
import { DocsComponent } from './docs/docs.component';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
    { path: "demo", component: DemoComponent },
    { path: "docs", component: DocsComponent },
    { path: "about", component: AboutComponent },
    { path: '**', component: DemoComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        DemoComponent,
        DocsComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        ),
        NgbModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
