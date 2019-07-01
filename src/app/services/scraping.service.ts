import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GoogleImages } from '../pages2scrap/googleimages';
import * as cheerio from 'cheerio';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { catchError, map, retryWhen } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrapingService {
  isWeb: boolean;
  constructor(
    private http: HttpClient,
    private httpnative: HTTP,
    private googleimages: GoogleImages,
    private platform: Platform) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.isWeb = false;
    } else {
      this.isWeb = true;
    }
  }

  public scrapUnit(imagensearch): Observable<any> {
    this.googleimages.setImageSearch(imagensearch);
    return this.scrapGeneralCheerio(this.googleimages.url, this.googleimages.processParameters(), this.googleimages.domproperties);
  }

  public scrapGeneralCheerio(url, parameters, domproperties) {
    let obs = new Observable( observer => {
      let page;
      let images = [];
      let rootNode = domproperties['rootNode'];
      let bodyNodes = domproperties['body'];
      this.http.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url + parameters)}`).subscribe(resHtml => {
        if (resHtml['status'].http_code == 403) {
          observer.next(resHtml['status']);   
        } else {
          page = cheerio.load(resHtml['contents']);
          page(rootNode).each((i, e) => {
            let imgObj = {};
            for (let k in bodyNodes) {
              if (k == 'id') {
                // @Todo Add Id field
                if (Array.isArray(bodyNodes[k])) {
                  // prodObj[k] =  
                } else {
                  // prodObj[k] = page(bodyNodes[k], e).attr(bodyNodes[k]);
                }
              } else{ 
                imgObj[k] = page(e).attr('src');
                /*if (k == 'src64') {
                  imgObj[k] = page(bodyNodes[k], e).attr('src'); 
                }*/
              } 
            }
            images.push(imgObj);
          });
          observer.next(images);
        }
        observer.complete();
      }, err => {
        observer.error(err);
      });
    });
    return obs.pipe(
      map(val => {
        if (false) {
          throw val;
        }
        return val;
      }),
      retryWhen(err => err)
    );
  }

  public scrapSerpApi(imgsearch) {
    return new Promise((resolve, reject) => {
      const url = 'https://serpapi.com/search.json?q=' + imgsearch + '&tbm=isch&ijn=0';
      const params = {}, headers = {};
      this.httpnative.get(url, params, headers).then(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }

  public scrapSerpApi2(imgsearch) {
    return new Promise((resolve, reject) => {
      const url = 'https://serpapi.com/search.json?q=' + imgsearch + '&tbm=isch&ijn=0';
      const params = {}, headers = {};
      this.http.get(url).subscribe(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }
}

