import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';


const routes: Routes = [
  {
    'path': 'contacts',
    component: ContactsListComponent
  },
  {
    path: 'auth/callback',
    component: AuthRedirectComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
