import { Component } from '@angular/core';
import { FilemanagerService } from '../../services/filemanager.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(private filemanager: FilemanagerService) {}

  ionViewWillEnter() {
    this.filemanager.checkDirectoriesExist().then((created) => {
      console.log('verificacion de directorios hecha');
    });
  }
}
