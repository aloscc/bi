import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { IMAGE } from "../constants/image.const";
import { Camera } from '@ionic-native/camera/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ImagemanagerService {
  base_image_path: string = '';
  private win: any = window;
  companyid: any;
  constructor(
    private file: File,
    private httpClient: HttpClient,
    private imagePicker: ImagePicker,
    private camera: Camera,
    public toastCtrl: ToastController
  ) {}

  setPaths() {
    this.companyid = localStorage.getItem("_usercompany");
    this.base_image_path = this.file.dataDirectory + 'problems/' + this.companyid + '/';
  }
  toImages64(images) {
    this.setPaths();
    return new Promise(resolve => {
      let images64 = [];
      for (let image of images) {
        images64.push(this.readImg(image));
      }
      if(images.length > 0) {
        Promise.all(images64).then(i64s => {
          resolve(i64s);
        });
      } else {
        resolve(images64);
      }
    });
  }
  readImg(img) {
    return new Promise(resolve => {
      this.httpClient.get(this.pathForImage(this.base_image_path + img), {responseType: 'blob'}).subscribe(imgblob => {
        let fileReader = new FileReader();
        fileReader.onloadend = (e) => {
          let imageData = fileReader.result;
          let rawData = (<string>imageData).split("base64,");
          let image64 = {
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

  removeImages(images) {
    this.setPaths();
    return new Promise((resolve, reject) => {
      let removeImages = [];
      for (let image of images) {
        if(typeof image == 'string')  removeImages.push(this.file.removeFile(this.base_image_path, image));
      }
      if(images.length > 0) {
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
      let converted = this.win.Ionic.WebView.convertFileSrc(img); 
      return converted;
    }
  }

  public getLocalPicture() {
    this.setPaths();
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
        for (var i = 0; i < results.length; i++) {
          var currentName = results[i].substr(results[i].lastIndexOf('/') + 1);
          var correctPath = results[i].substr(0, results[i].lastIndexOf('/') + 1);
          localimages.push(this.copyFileToLocalDir(correctPath, currentName, this.createFileName()));
        }
        Promise.all(localimages).then(images => {
          resolve(images); 
        }, error => {
          reject(error);
        });
      });
    });
  }

  public takePicture() {
    this.setPaths();
    return new Promise((resolve, reject) => {
      let sourceType = this.camera.PictureSourceType.CAMERA;
      // Create options for the Camera Dialog
      let options = {
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
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then(imagen => {
          resolve(imagen);
        });
      }, (err) => {
        reject(err);
      });
    });
  }

  // Create a new name for the image
  private createFileName() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    return new Promise((resolve, reject) => {
      this.file.copyFile(namePath, currentName, this.base_image_path, newFileName).then(success => {
        let lastImage = newFileName;
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

