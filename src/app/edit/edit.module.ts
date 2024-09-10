import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EditComponent } from './edit.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule,RouterModule.forChild([{ path: '', component: EditComponent }])],
  declarations: [EditComponent],
})
export class EditComponentModule {}
