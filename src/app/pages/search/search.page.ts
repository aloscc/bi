import { Component } from '@angular/core';
import { ScrapingService } from '../../services/scraping.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {
  images: any[] = [];
  imagevalue = '';
  constructor(
    private scrapingservice: ScrapingService,
    private popoverCtrl: PopoverController,
  ) {
  }
  searchImages() {
    console.log('imagen a buscar:' + this.imagevalue);
    this.scrapingservice.scrapUnit(this.imagevalue).subscribe(res => {
      this.images = res;
    });
  }

  keypressEnter(keycode) {
    if(keycode == 13) {
      this.searchImages();
    }
  }
  
  async presentPopover(ev, img) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps: {
        img:img
      },
      event: ev,
      translucent: true
    });
    await popover.present();
  }
}
