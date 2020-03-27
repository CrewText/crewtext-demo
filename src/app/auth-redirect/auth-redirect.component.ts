import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import jsonwebtoken from 'jsonwebtoken'
import { JWT } from 'jose'

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
      let [key, val] = item.split('=', 1)
      console.log(key)


      if (key == "access_token") { this.authSvc.access_token = val }
      else if (key == "id_token") { this.authSvc.id_token = val }
      else if (key == "expires_in") {
        console.log(`expire time: ${JWT.decode(val)}`)
        // this.authSvc.id_expire_time =
      }
    }
  }

}
