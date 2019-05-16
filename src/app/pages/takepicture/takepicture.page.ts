import { Component, OnInit } from '@angular/core';
import { ImagemanagerService } from '../../services/imagemanager.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-takepicture',
  templateUrl: './takepicture.page.html',
  styleUrls: ['./takepicture.page.scss'],
})
export class TakepicturePage implements OnInit {
  images = [];
  constructor(
    private imageManager: ImagemanagerService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  presentActionSheetCamera() {
    this.imageManager.takePicture().then(img => {
      this.images.push(img);
    }, error => {
    });
  }

  presentActionSheetImage() {
    this.imageManager.getLocalPicture().then(imgs => {
      let ii = imgs as Array<any>;
      ii.forEach(img => {
        this.images.push(img);
      });
    }, error => {
    });
  }

  pathForImage(img) {
    return this.imageManager.pathForImage(img);
  }

  deleteImage(i){
    this.images.splice(i, 1);
  }

  async presentPopover(ev, imgObj) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps: {
        img: imgObj,
        typesave: 'copy'
      },
      event: ev,
      translucent: true
    });
    await popover.present();
  }
}

