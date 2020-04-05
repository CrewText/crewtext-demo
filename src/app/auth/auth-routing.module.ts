import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';


const routes: Routes = [
  {
    'path': 'auth',
    children: [
      {
        'path': 'callback',
        component: AuthRedirectComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
