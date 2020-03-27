import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { Base64 } from 'js-base64'

@Component({
  selector: 'app-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrls: ['./auth-redirect.component.css']
})
export class AuthRedirectComponent implements OnInit {

  constructor(private router: Router, private authSvc: AuthService) { }

  ngOnInit() {
    for (let item of location.hash.split('&')) {
      item = item.replace('#', '')
      let [key, val] = item.split('=')
      console.log(key)
      if (key == "access_token") {
        this.authSvc.access_token = JSON.parse(Base64.decode(val.split('.')[1]))
        this.authSvc.jwt = val
      }
      else if (key == "id_token") { this.authSvc.id_token = JSON.parse(Base64.decode(val.split('.')[1])) }

      this.router.navigateByUrl('/contacts')
    }
  }

}
