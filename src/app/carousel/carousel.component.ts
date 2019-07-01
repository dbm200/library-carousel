import { Component, OnInit, AfterViewInit, OnChanges, Input } from '@angular/core';
import { HttpService } from './../http.service';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnChanges {
  public resultsList = [];
  public imgList = [];
  // setter queryToProcess
  private _queryToProcess: string;
  @Input()
  set queryToProcess(queryToProcess: string) {
    if (!queryToProcess) {
      return;
    }
    this._queryToProcess = queryToProcess;
    this.httpService.getBooks(queryToProcess)
      .subscribe(results => {
        this.resultsList = results;
        if (this.resultsList.length >= 3) {
          this.imgList = this.resultsList.slice(0, 3);
        } else {
          this.imgList = this.resultsList;
        }
      });
  }

  get queryToProcess(): string {
    return this._queryToProcess;
  }
  // 
  constructor(private httpService: HttpService) {}
  
  /**
   * Makes possible to retreive element of an array
   * that has index number < 0 or > array.length - 1
   * by cycling through array length and returning normalized index
   * e.g. A = ['a', 'b', 'c']
   * A[cycle(-1, A.length)] -> 'c'
   * A[cycle(3, A.length)] -> 'a'
   * 
   * @target array index to be normalized
   * @arrayLength
   */
  public cycle = (target, arrayLength) => {
    if (target < 0) {
        const raw = Math.abs(target % arrayLength);
        if (raw === 0) {
            return 0;
        } else {
            return arrayLength - raw;
        }
    } else if (target === 0) {
        return 0;
    } else {
        return target % arrayLength;
    }
};

  public runCarousel() {
    setInterval(() => {
      if (document.hidden) {
        return;
      }
      const carouselImages = document.getElementsByClassName('carousel__photo');
      let numberOfImages = carouselImages.length;
      if (numberOfImages === 0) {
        return;
      }
      let activeImageIndex: number;
      // determine current active image
      for (let i = 0; i < carouselImages.length; i++) {
        if (carouselImages[i].classList.contains('active')) {
          activeImageIndex = i;
        }
      }
      
      if (!activeImageIndex) {
        activeImageIndex = 0;
        carouselImages[carouselImages.length - 1].classList.add('prev');
        carouselImages[0].classList.add('active');
        carouselImages[1].classList.add('next');
      }

      // when current image is close to an end of array...
      const isOneBeforeLastImage = carouselImages.length - 1 - activeImageIndex <= 1;
      const nextResult = this.resultsList[activeImageIndex + 2];
      if (isOneBeforeLastImage && nextResult) {
        this.imgList.push(this.resultsList[activeImageIndex + 2]);
      }

      carouselImages[activeImageIndex].classList.remove('active');
      carouselImages[this.cycle(activeImageIndex - 1, numberOfImages)].classList.remove('prev')
      carouselImages[this.cycle(activeImageIndex + 1, numberOfImages)].classList.remove('next')

      carouselImages[this.cycle(activeImageIndex, numberOfImages)].classList.add('prev');
      carouselImages[this.cycle(activeImageIndex + 1, numberOfImages)].classList.add('active');
      carouselImages[this.cycle(activeImageIndex + 2, numberOfImages)].classList.add('next');
      
    }, 3000);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.runCarousel();
  }

  ngOnChanges() {
  }

}
