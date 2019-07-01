import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { FilemanagerService } from '../../services/filemanager.service';
import { ImagemanagerService } from '../../services/imagemanager.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input('img') img;
  @Input('typesave') typesave;
  constructor(
    private popCtrl: PopoverController,
    private filemanager: FilemanagerService,
    private imageManager: ImagemanagerService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  saveImg(despath, imgname) {
    imgname = imgname + (new Date()).getTime();
    if (this.typesave === 'download') {
      const url = this.img.src;
      this.filemanager.downloadSync(url, despath, imgname).then((created) => {
        console.log('>imagen guardada en directorio');
        this.presentToast(despath).then(res => {
          this.popCtrl.dismiss();
        });
      });
    } else {
      this.imageManager.copyFileToLocalDir(this.img.imgpath, this.img.imgname, despath, imgname).then(img => {
        console.log('Se guardo imagen');
        this.presentToast(despath).then(res => {
          this.popCtrl.dismiss();
        });
      });
    }
  }

  async close() {
    await this.popCtrl.dismiss();
  }

  async presentToast(des) {
    const toast = await this.toastCtrl.create({
      message: 'La imagen fue guarda en la seccion ' + des,
      duration: 2000
    });
    toast.present();
  }
}
