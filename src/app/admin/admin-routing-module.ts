import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UsersPageComponent } from './users-page/users-page.component';

const routes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'overview',
                component: AdminPageComponent,
            },
            {
                path: 'users',
                component: UsersPageComponent,
            },
            {
                path: '',
                redirectTo: '/admin/overview',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
