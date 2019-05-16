import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './search.page';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SearchPage }]),
  ],
  entryComponents: [PopoverComponent],
  declarations: [SearchPage, PopoverComponent]
})
export class SearchPageModule {}
