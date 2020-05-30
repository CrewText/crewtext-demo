import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Auth0Service } from 'src/app/auth0.service';
import { BasicUser } from 'src/app/basic-user';
import { UserCreateFormComponent } from '../user-create-form/user-create-form.component';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  public users: BasicUser[] = []

  constructor(public authSvc: AuthService, public auth0Svc: Auth0Service) { }
  @ViewChild(UserCreateFormComponent) userCreateForm: UserCreateFormComponent

  ngOnInit(): void {
    //@ts-ignore
    $("#add-new-user-modal").modal()
    this.auth0Svc.getUsers(this.authSvc.userOrg, this.authSvc.jwt)
      .subscribe(returnedUsers => {
        this.users = this.users.concat(returnedUsers)
      })
  }

  showNewUserForm() {
    this.userCreateForm.resetForm()
    //@ts-ignore
    $("#add-new-user-modal").modal("show")
  }

}
