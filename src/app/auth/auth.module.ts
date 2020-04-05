import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';


@NgModule({
  declarations: [AuthRedirectComponent],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
