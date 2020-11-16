import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ServicechainEditorComponent } from './servicechain-editor/servicechain-editor.component'
import { ServicechainListComponent } from './servicechain-list/servicechain-list.component'


const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'create',
        component: ServicechainEditorComponent
      },
      {
        path: '',
        component: ServicechainListComponent
      },
      // {
      // path:'compose':
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicechainRoutingModule { }
