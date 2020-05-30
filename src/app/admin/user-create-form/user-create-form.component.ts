import { Component, OnInit } from '@angular/core';
import md5 from 'md5';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { Auth0Service } from 'src/app/auth0.service';
import { AuthService } from 'src/app/auth.service';
import { VolubleService } from 'src/app/voluble.service';
import { Router } from '@angular/router';

let emailInput: HTMLInputElement;
let avatarSrcInput: HTMLInputElement

@Component({
  selector: 'app-user-create-form',
  templateUrl: './user-create-form.component.html',
  styleUrls: ['./user-create-form.component.css']
})
export class UserCreateFormComponent implements OnInit {

  constructor(private auth0Svc: Auth0Service, private authSvc: AuthService, private volubleSvc: VolubleService, private router: Router) { }

  ngOnInit(): void {
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
    $('#userCreateForm').form('reset')
    avatarSrcInput.value = "https://www.gravatar.com/avatar/0?d=mp"
    document.getElementById('createUserList').classList.add('hide')

    document.getElementById("createUserIdentityMgrItem").className = "notched circle loading icon"
    document.getElementById("sendPwdResetItem").className = "notched circle loading icon"
    document.getElementById("addToOrgItem").className = "notched circle loading icon"
  }

  createUser() {
    //@ts-ignore
    let formVals = $('#userCreateForm').form('get values')
    document.getElementById('createUserList').classList.remove('hide')
    this.auth0Svc.createUser(this.authSvc.userOrg,
      formVals["first-name"],
      formVals["last-name"],
      formVals['avatar'],
      formVals['email-address'],
      this.authSvc.jwt)
      .then(resp => {
        document.getElementById("createUserIdentityMgrItem").className = "green check icon"
        Promise.all([
          this.authSvc.sendPasswordReset(resp["email"], this.authSvc.access_token).then(() => document.getElementById("sendPwdResetItem").className = "green check icon").catch(() => document.getElementById("sendPwdResetItem").className = "red times icon"),
          this.volubleSvc.createUser(this.authSvc.userOrg, resp.user_id).then(() => document.getElementById("addToOrgItem").className = "green check icon").catch(() => document.getElementById("addToOrgItem").className = "red times icon")
          //TODO: #1 Assign user permissions

        ])
          .then(() => {
            window.location.reload()
          })
      })
      //TODO: Add error checking
      .catch(() => { document.getElementById("createUserIdentityMgrItem").className = "red times icon" })

  }
}
