import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { AuthService } from 'src/app/auth.service';
import { VolubleService } from 'src/app/voluble.service';

@Component({
  selector: 'app-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrls: ['./auth-redirect.component.css']
})
export class AuthRedirectComponent implements OnInit {

  constructor(private router: Router, private authSvc: AuthService, private volubleSvc: VolubleService) { }

  ngOnInit() {
    for (let item of location.hash.split('&')) {
      item = item.replace('#', '')
      let [key, val] = item.split('=')
      if (key == "access_token") {
        this.authSvc.access_token = JSON.parse(Base64.decode(val.split('.')[1]))
        this.authSvc.jwt = val
      }
      else if (key == "id_token") { this.authSvc.id_token = JSON.parse(Base64.decode(val.split('.')[1])) }
    }

    this.volubleSvc.getUserSelf(this.authSvc.access_token.sub)
      .then(resp => {
        return resp.json()
          .then(resp_body => {
            if (resp_body.errors && resp.status != 404) { throw new Error(resp_body.errors[0].detail) }
            if (!resp_body.data.relationships.organization.data) {
              this.authSvc.userOrg == undefined;
              return
            }
            this.authSvc.userOrg = resp_body.data.relationships.organization.data.id
          })
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => { return this.router.navigateByUrl('/dashboard') })
  }

}
