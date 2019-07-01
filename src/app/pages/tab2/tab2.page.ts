import { Component, OnInit } from '@angular/core';
import { FilemanagerService } from '../../services/filemanager.service';
import { SlideimagesComponent } from 'src/app/components/slideimages/slideimages.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  images = [];
  win: any = window;
  constructor(
    private filemanager: FilemanagerService,
    private modalController: ModalController
  ) {}

  ionViewDidEnter() {
    this.listFiles();
  }

  ionViewWillEnter() {
    console.log('entro a ionViewWillEnter');
  }

  ngOnInit() {}

  listFiles() {
    this.filemanager.listFiles('doors').then(res => {
      this.images = res.map(imgobj => this.pathForImage(imgobj.nativeURL));
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      const converted = this.win.Ionic.WebView.convertFileSrc(img);
      return converted;
    }
  }

  async openModalGallery(imgindex) {
    const modal = await this.modalController.create({
      component: SlideimagesComponent,
      componentProps: {
        index: imgindex,
        images: this.images
      }
    });
    return await modal.present();
  }
}
