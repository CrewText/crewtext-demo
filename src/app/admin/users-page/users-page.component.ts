import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Auth0Service } from 'src/app/auth0.service';
import { BasicUser } from 'src/app/basic-user';
import { VolubleService } from 'src/app/voluble.service';
import { UserCreateFormComponent } from '../user-create-form/user-create-form.component';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  public users: BasicUser[] = []
  userDeletePromptName: string

  constructor(public authSvc: AuthService, public auth0Svc: Auth0Service, private volubleSvc: VolubleService) { }
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

  deleteUser(user_id: string) {
    for (const user of this.users) {
      if (user.user_id == user_id) {
        this.userDeletePromptName = user.name ? user.name : `${user.given_name} ${user.family_name}`
        break
      }
    }

    //@ts-ignore
    $('#deleteModal').modal({
      onApprove: async () => {
        await Promise.all([
          this.volubleSvc.users.deleteUser(this.authSvc.userOrg, user_id),
          this.auth0Svc.deleteUser(this.authSvc.userOrg, user_id, this.authSvc.jwt)
        ])
          .then((resp) => {
            window.location.reload()
          })
      }
    })

    //@ts-ignore
    $('#deleteModal').modal('show')
  }

}
