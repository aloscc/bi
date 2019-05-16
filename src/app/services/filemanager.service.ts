import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilemanagerService {
  constructor(
    private file: File,
    private httpClient: HttpClient,
  ) {
  }

  checkDirectoriesExist() {
    let created = [];
    created.push(this.createDirectory('doors'));
    created.push(this.createDirectory('beds'));  
    created.push(this.createDirectory('furnitures'));
    return Promise.all(created).then(() => Promise.resolve(true));
  }

  createDirectory(dirname) {
    return new Promise((resolve) => {
      this.file.checkDir(this.file.dataDirectory, dirname).then((exist) => {
        resolve(true);
      },(error) => {
        this.file.createDir(this.file.dataDirectory, dirname, false).then((dir) => {
          resolve(true);
        });
      });
    });
  }

  listFiles(dirname) {
    return this.file.listDir(this.file.dataDirectory, dirname);
  }

  checkFileExist(path, namefile) {
    return this.file.checkFile(path, namefile);
  }

  downloadFilesSync(images) {
    return new Promise(resolve => {
      let arrimgs = [];
      for (let i = 0; i < images.length; i ++) {
        arrimgs.push(this.downloadSync(images[i].src, images[i].despath, images[i].name));
      }
      Promise.all(arrimgs).then(rs => {
        resolve(true);
      }); 
    });
  }

  downloadSync(url, despath, filename) {
    return new Promise(resolve => {
      this.httpClient.get(url, {responseType: 'blob'}).subscribe(imgblob => {
          if (imgblob) {
            this.file.writeFile(this.file.dataDirectory + despath + '/', filename, imgblob, {replace: true}).then((entry)=>{
              resolve('download completed: ' + entry.nativeURL);
            }, (error) => {
              resolve('download failed: ' + error);
            }); 
          } else resolve('we didnt get an XHR response!');
        }, error => {
          resolve('download failed: ' + error);
        });
    });
  }

  // contentType: 'image/png' 
  dataURItoBlob(dataURI, contentType = '') {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });    
    return blob;
  }

  saveBase64(base64:string, name:string):Promise<string> {
    return new Promise((resolve, reject) => {
      let blob = this.dataURItoBlob(base64, 'image/png');
      this.file.writeFile(this.file.dataDirectory + 'signatures/', name, blob, {replace: true}).then((entry)=>{
        resolve(entry.nativeURL);
      }, error => {
        reject(error)
      });
    })
  }
}



