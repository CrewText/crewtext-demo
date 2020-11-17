import { Component, OnInit } from '@angular/core';
import md5 from 'md5';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { Auth0Service } from 'src/app/auth0.service';
import { VolubleService } from 'src/app/voluble.service';

let emailInput: HTMLInputElement;
let avatarSrcInput: HTMLInputElement

@Component({
  selector: 'app-user-create-form',
  templateUrl: './user-create-form.component.html',
  styleUrls: ['./user-create-form.component.css']
})
export class UserCreateFormComponent implements OnInit {

  constructor(private auth0Svc: Auth0Service, private authSvc: AuthService, private volubleSvc: VolubleService) { }
  availableRoles: { id: string, name: string, description: string }[]

  async ngOnInit(): Promise<void> {

    this.availableRoles = await this.auth0Svc.getRoles(this.authSvc.jwt)
    //@ts-ignore
    $('#userCreateForm').form()

    emailInput = <HTMLInputElement>document.getElementById('emailInput')
    avatarSrcInput = <HTMLInputElement>document.getElementById('avatarInput')

    fromEvent(emailInput, 'input')
      .pipe(map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        debounceTime(50),
        filter(text => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text)),
        distinctUntilChanged(),
        switchMap((text) => fetch(`https://en.gravatar.com/${md5(text)}.json`, { redirect: "follow", method: "GET" }))
      )
      .subscribe(async resp => {
        //@ts-ignore
        $("#avatar").transition({
          animation: 'scale out',
          duration: "100ms",
        })

        if (!resp.ok) {
          avatarSrcInput.value = `https://www.gravatar.com/avatar/${md5(emailInput.value)}?d=identicon`

          //@ts-ignore
          $("#avatar").transition({
            animation: 'scale in',
            duration: "250ms",
          })
        } else {

          let respJson = await resp.json()
          let profile = respJson["entry"][0]

          //avatarImg.src = profile["photos"][0]["value"]
          avatarSrcInput.value = profile["photos"][0]["value"]

          //@ts-ignore
          $("#avatar").transition({
            animation: 'scale in',
            duration: "250ms",
          })

          if (profile["name"]["givenName"]) { (<HTMLInputElement>document.getElementById('firstName')).value = profile["name"]["givenName"] }
          if (profile["name"]["familyName"]) { (<HTMLInputElement>document.getElementById('lastName')).value = profile["name"]["familyName"] }
        }
      })
  }

  resetForm() {
    //@ts-ignore
    $("#createUserListDimmer").dimmer("hide")
    //@ts-ignore
    $('#userCreateForm').form('reset')
    //@ts-ignore
    $(".ui.checkbox").checkbox()

    avatarSrcInput.value = "https://www.gravatar.com/avatar/0?d=mp"
    //document.getElementById('createUserList').classList.add('hide')


    document.getElementById("createUserIdentityMgrItem").className = "notched circle loading icon"
    document.getElementById("sendPwdResetItem").className = "notched circle loading icon"
    document.getElementById("addToOrgItem").className = "notched circle loading icon"
    document.getElementById("setUserRoleItem").className = "notched circle loading icon"
  }

  async createUser() {
    //@ts-ignore
    let formVals = $('#userCreateForm').form('get values')

    //@ts-ignore
    $("#createUserListDimmer").dimmer("show")
    let createdUser = await this.auth0Svc.createUser(this.authSvc.userOrg,
      formVals["first-name"],
      formVals["last-name"],
      formVals['avatar'],
      formVals['email-address'],
      this.authSvc.jwt)
      .then(async resp => {
        document.getElementById("createUserIdentityMgrItem").className = "green check icon"
        return resp
      })
      .catch(() => { document.getElementById("createUserIdentityMgrItem").className = "red times icon" })

    await Promise.all([
      this.authSvc.sendPasswordReset(createdUser["email"], this.authSvc.access_token).then(() => document.getElementById("sendPwdResetItem").className = "green check icon").catch(() => document.getElementById("sendPwdResetItem").className = "red times icon"),
      this.volubleSvc.users.createUser(this.authSvc.userOrg, createdUser.user_id).then(() => document.getElementById("addToOrgItem").className = "green check icon").catch(() => document.getElementById("addToOrgItem").className = "red times icon")
    ]);

    const userRoles = Array.from(document.getElementsByClassName("role-checkbox") as HTMLCollectionOf<HTMLInputElement>)
      .filter(el => el.checked)
      .map(el => el.id)

    await this.auth0Svc.setUserRoles(this.authSvc.userOrg, createdUser.user_id, userRoles, this.authSvc.jwt)
      .then(_ => document.getElementById("setUserRoleItem").className = "green check icon")
      .catch(e => { document.getElementById("setUserRoleItem").className = "red times icon"; console.error(e) })

    //TODO: Add error checking

    window.location.reload();

  }
}
