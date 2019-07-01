import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, expand, filter, reduce, takeUntil } from 'rxjs/operators';
import { Observable, empty, Subject } from "rxjs";

// for legacy reasons I extend array interface
// to silence the compiler complaining about Array.prototype.flat()
declare global {
  interface Array<T> {
    flat(): Array<T>;
    flatMap(func: (x: T) => T): Array<T>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public cancelFlight = new Subject();

  constructor(private http: HttpClient) {}
    
  getBooks(queryToProcess: string) {
    const parsedQuery = queryToProcess.replace(' ', '+')
    return this.http.get(`http://openlibrary.org/search.json?q=${parsedQuery}`)
    .pipe(
      map(fullResponse => {
        // only with cover images
        return fullResponse['docs'].filter(curr => curr.cover_i && curr.cover_i > 0 && curr.isbn);
      }),
      // take only needed props
      map(arrayOfAllProps => arrayOfAllProps
        .map(curr => {
          const getApiImgSize = () => {
            const innerHeight = window.innerHeight;
            if (innerHeight < 300) {
              return 'S';
            } else if (innerHeight > 600) {
              return 'L';
            } else {
              return 'M'
            }
        }
        return {
          cover_i: curr['cover_i'],
          author_name: curr['author_name'],
          isbn: curr['isbn'],
          title: curr['title'],
          cover_url: `http://covers.openlibrary.org/b/isbn/${curr['isbn'][0]}-${getApiImgSize()}.jpg`,
        }
      })),
      tap(x => {
        console.warn(x);
      })
    );
  }

  // *** USE WITH CAUTION ***
  // The method below implements RxJS-based pagination 
  // and lets you get all results from books api
  // but because there may be > 15000 entries for less specific queries 
  // this method remains unused
  // and up to 100 are fetched (1 page) using method above
  // use stackblitz to see working example
  // https://stackblitz.com/edit/http-pagination

  public getAllBooks(queryToProcess: string) {
    const parsedQuery = queryToProcess.replace(' ', '+')
    this.fetchAllBooks(`https://openlibrary.org/search.json?q=${parsedQuery}`).subscribe(r => {
    })
  }

  public fetchAllBooks(from: string): Observable<any> {
    let page = 1;
    // cancel other in-flight requests
    this.cancelFlight.next(null);

    return Observable.create(observer => {
      this.getPage(from).pipe(
        // ask next page if exists
        expand(data => {
          // uncomment if you want to have intermediate results
          // or use scan instead of reduce in pipe below

          // observer.next(data);
          page++;
          return data.docs.length > 0 ? this.getPage(`${from}&page=${page}`) : empty();
        }),
        // return all pages as single array of arrays instead of one-by-one
        reduce((acc, d) => {
          return acc.concat(d);
        }, []),
        map(curr => {
          return curr.map(curr => curr['docs'])
        }),
        // flat array of arrays
        map(aOfA => {
          return aOfA.flat()
        }))
        .subscribe(r => {
          observer.next(r);
          observer.complete();
        });
    });
  }

  // gets a single paginated page
  // helper method
  private getPage(url: string): Observable<any> {
    return this.http.get(url).pipe(
      takeUntil(this.cancelFlight)
    );
  }

}
