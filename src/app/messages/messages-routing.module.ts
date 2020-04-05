import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MessagesListComponent } from './messages-list/messages-list.component';


const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [{
      'path': '',
      component: MessagesListComponent
    }
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
export class MessagesRoutingModule { }
