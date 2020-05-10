import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { AssignOrganizationComponent } from './assign-organization/assign-organization.component';



@NgModule({
  declarations: [DashboardPageComponent, DashboardViewComponent, AssignOrganizationComponent],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
