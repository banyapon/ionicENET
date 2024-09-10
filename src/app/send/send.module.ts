import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { SendComponent } from "./send.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,  
        RouterModule.forChild([{ path: '', component: SendComponent }])],
    declarations: [SendComponent],
})
export class SendComponentModule {

}
