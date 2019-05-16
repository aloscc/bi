import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { FilemanagerService } from '../../services/filemanager.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input("img") img;
  constructor(
    private popCtrl: PopoverController,
    private filemanager: FilemanagerService
  ) {}

  ngOnInit() {}

  saveImg(despath, imgname) {
    const url = this.img.src;
    imgname = imgname + (new Date()).getTime();
    this.filemanager.downloadSync(url, despath, imgname).then((created) => {
      console.log('>imagen guardada en directorio');
    });
  }

  async close() {
    await this.popCtrl.dismiss();
  }
}
