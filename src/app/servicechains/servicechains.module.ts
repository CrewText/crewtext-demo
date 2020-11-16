import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicechainEditorComponent } from './servicechain-editor/servicechain-editor.component';
import { ServicechainListComponent } from './servicechain-list/servicechain-list.component';
import { ServicechainRoutingModule } from './servicechains-routing.module';



@NgModule({
  declarations: [ServicechainEditorComponent, ServicechainListComponent],
  imports: [
    ServicechainRoutingModule,
    CommonModule
  ]
})
export class ServicechainsModule { }
