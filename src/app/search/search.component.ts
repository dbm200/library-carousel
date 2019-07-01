import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public e;
  @Output() queryEmitter: EventEmitter<any> = new EventEmitter();

  public lastQueryTime;
  public lastQueryTimeFormatted;

  public queryToProcess;
  public micOn = false;
  public recognition;

  public libraryForm = new FormGroup({
    query: new FormControl({ value: '', disabled: false }),
  });
  
  onSubmit(e) {
    this.lastQueryTime = Date.now();
    this.queryToProcess = this.libraryForm.value.query;
    console.warn(this.libraryForm.value.query);
    this.queryEmitter.emit(this.queryToProcess);
    this.updateRelativeTime();
  }

  handleMicButton() {
    this.micOn = !this.micOn;
    if (this.micOn) {
      this.libraryForm.controls['query'].disable();
      this.recognizeAndUpdate(this.libraryForm);
      this.recognition.start();
    } else {
      this.libraryForm.controls['query'].enable();
      this.recognition.stop();
    }
  }

  recognizeAndUpdate(libraryForm: FormGroup) {
    this.recognition.onresult = function(event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          let recognitionResult = event.results[i][0].transcript;
          libraryForm.setValue({ query: recognitionResult });
        }
      }
    };
  }

  public updateRelativeTime() {
      this.lastQueryTime = Date.now();
  }

  public generateRelativeTime() {
    if (!this.lastQueryTime) {
      this.lastQueryTimeFormatted = '- - -'
    } else {
      const userLanguage = (<any>window).navigator.language;
      const rtf = new (<any>window).Intl.RelativeTimeFormat(userLanguage, { numeric: "auto"});
      const timeDiff = Math.floor((this.lastQueryTime - Date.now()) / 1000);
      const timeDiffAbs = Math.abs(timeDiff);
      if (timeDiffAbs < 60) {
        this.lastQueryTimeFormatted = rtf.format(timeDiff, 'second')
      } else if (timeDiffAbs >= 60 && timeDiffAbs < 3600) {
        const minutes = Math.trunc(timeDiff / 60);
        this.lastQueryTimeFormatted = rtf.format(minutes, 'minute');
      } else if (timeDiffAbs >= 3600 && timeDiffAbs < 86400) {
        const hours = Math.trunc(timeDiff / 3600);
        this.lastQueryTimeFormatted = rtf.format(hours, 'hour');
      } else {
        const days = Math.trunc(timeDiff / 86400)
        this.lastQueryTimeFormatted = rtf.format(days, 'day');
      }
    }
  }

  ngOnInit() {
    setInterval(() => { this.generateRelativeTime() }, 1000);
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (<any> window).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      // this also could be navigator language as well
      // but en-US is best supported
      // this.recognition.lang = this.userLanguage;
      this.recognition.lang = 'en-US';
    }

  }

}
