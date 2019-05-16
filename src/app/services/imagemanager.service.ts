import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { IMAGE } from '../constants/image.const';
import { Camera } from '@ionic-native/camera/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ImagemanagerService {
  private win: any = window;
  constructor(
    private file: File,
    private httpClient: HttpClient,
    private imagePicker: ImagePicker,
    private camera: Camera,
    public toastCtrl: ToastController
  ) {}

  toImages64(path, images) {
    return new Promise(resolve => {
      const images64 = [];
      for (const image of images) {
        images64.push(this.readImg(path, image));
      }
      if (images.length > 0) {
        Promise.all(images64).then(i64s => {
          resolve(i64s);
        });
      } else {
        resolve(images64);
      }
    });
  }

  readImg(path, img) {
    return new Promise(resolve => {
      this.httpClient.get(this.pathForImage(path + img), {responseType: 'blob'}).subscribe(imgblob => {
        const fileReader = new FileReader();
        fileReader.onloadend = (e) => {
          const imageData = fileReader.result;
          const rawData = (<string>imageData).split("base64,");
          const image64 = {
            type: rawData[0],
            file: rawData[1],
            name: img
          };
          resolve(image64);
        };
        fileReader.readAsDataURL(imgblob);
      });
    });
  }

  removeImages(path, images) {
    return new Promise((resolve, reject) => {
      const removeImages = [];
      for (const image of images) {
        if (typeof image === 'string') {
          removeImages.push(this.file.removeFile(path, image));
        }
      }
      if (images.length > 0) {
        Promise.all(removeImages).then( (rImages) => {
          resolve(rImages);
        }, error => {
          reject(error);
        });
      } else {
        resolve(removeImages);
      }
    });
  }

  // Always get the accurate path to your apps folder.
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      const converted = this.win.Ionic.WebView.convertFileSrc(img);
      return converted;
    }
  }

  public getLocalPicture() {
    return new Promise((resolve, reject) => {
      // Create options for the Camera Dialog
      this.imagePicker.getPictures(
        {
          quality: IMAGE.quality,
          width: IMAGE.width,
          height: IMAGE.height,
          maximumImagesCount: 10,
        }
      ).then((results) => {
        let localimages = [];
        for (let i = 0; i < results.length; i++) {
          const currentName = results[i].substr(results[i].lastIndexOf('/') + 1);
          const correctPath = results[i].substr(0, results[i].lastIndexOf('/') + 1);
          const imgObj = {
            imgname: currentName,
            imgpath: correctPath
          };  
          localimages.push(imgObj);
          //localimages.push(this.copyFileToLocalDir(correctPath, currentName, 'doors', this.createFileName()));
        }
        resolve(localimages);
        /*Promise.all(localimages).then(images => {
          resolve(images);
        }, error => {
          reject(error);
        });*/
      });
    });
  }

  public takePicture() {
    return new Promise((resolve, reject) => {
      const sourceType = this.camera.PictureSourceType.CAMERA;
      // Create options for the Camera Dialog
      const options = {
        quality: IMAGE.quality,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: IMAGE.width,
        targetHeight: IMAGE.height
      };

      // Get the data of an image
      this.camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        const imgObj = {
          imgname: currentName,
          imgpath: correctPath
        };
        resolve(imgObj);
        /*this.copyFileToLocalDir(correctPath, currentName, 'doors', this.createFileName()).then(imagen => {
          resolve(imagen);
        });*/
      }, (err) => {
        reject(err);
      });
    });
  }

  // Create a new name for the image
  private createFileName() {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  // Copy the image to a local folder
  copyFileToLocalDir(namePath, currentName, newpath, newFileName) {
    return new Promise((resolve, reject) => {
      this.file.copyFile(namePath, currentName, this.file.dataDirectory + newpath, newFileName).then(success => {
        const lastImage = newFileName;
        resolve(lastImage);
      }, (err) => {
        this.presentToast('Error mientras se seleccionaba la imagen: ' + currentName);
        reject(err);
      });
    });
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}

