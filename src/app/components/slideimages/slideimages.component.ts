import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-slideimages',
  templateUrl: './slideimages.component.html',
  styleUrls: ['./slideimages.component.scss'],
})
export class SlideimagesComponent implements OnInit {
  @Input("images") images;
  @Input("index") index;
  slideOpts: any;
  constructor(
    private modalController: ModalController
  ) {
    this.slideOpts = {
      initialSlide: this.index,
      speed: 400
    };
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
