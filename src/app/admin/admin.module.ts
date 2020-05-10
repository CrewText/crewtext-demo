import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminRoutingModule } from './admin-routing-module';
import { UsersPageComponent } from './users-page/users-page.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';


@NgModule({
  declarations: [AdminPageComponent, UsersPageComponent, AdminNavComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
