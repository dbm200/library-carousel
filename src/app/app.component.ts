import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from './http.service';
@Component({
  // uncomment to have source code working locally
  // as angular
  // selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {}
  public queryToProcess: string;

  public handleQueryFromSearch(e) {
    console.log('Event received:', e)
    this.queryToProcess = e;
  }

}
