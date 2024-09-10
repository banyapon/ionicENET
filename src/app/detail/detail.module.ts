import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DetailComponent } from "./detail.component";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,  
        RouterModule.forChild([{ path: '', component: DetailComponent }])],
    declarations: [DetailComponent],
})
export class DetailComponentModule {

}
