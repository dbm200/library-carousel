import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDepsModule } from './material-deps.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { FormsModule,  ReactiveFormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { CarouselComponent } from './carousel/carousel.component'
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    SearchComponent
  ],
  entryComponents: [ SearchComponent, CarouselComponent, AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialDepsModule,
    ReactiveFormsModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  // Uncomment `bootstrap` to use angular components as usual (for development)
  // Comment and build to use web components as standalone components that can be embedded
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(injector: Injector) {
    // searchEl and carouselEl are needed only if we want to use separate web components
    const searchEl = createCustomElement(SearchComponent, { injector });
    customElements.define('el-search', searchEl);
    const carouselEl = createCustomElement(CarouselComponent, { injector });
    customElements.define('el-carousel', carouselEl);
    // appEl is needed only when we want to ship a whole angular app as web component, 
    // for my convenience I registered all of them so that I can have single source code version
    const appEl = createCustomElement(AppComponent, { injector });
    customElements.define('el-app', appEl);
  }

  ngDoBootstrap() {}
}
