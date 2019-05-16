import { Injectable } from '@angular/core';

@Injectable()
export class GoogleImages {
  url = 'https://www.google.com/search';
  parameters = {
    q: 'camas',
    source: 'lnms',
    tbm: 'isch',
    sa: 'X'
  };
  domproperties = {
    rootNode: 'div a img',
    body: {
      src: '.rg_ic',
    }
  };
  setImageSearch(img) {
    this.parameters.q = img;
  } 
  processParameters() {
    let p = '?';
    for (let k in this.parameters) {
      p += (k + "=" + this.parameters[k] + '&'); 
    }
    return p;
  }
}


