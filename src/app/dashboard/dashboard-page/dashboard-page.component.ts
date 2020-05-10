import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  constructor(public authSvc: AuthService, public router: Router) {
    if (!this.authSvc.isLoggedIn) {
      this.authSvc.login();
    } else if (!this.authSvc.userOrg) {
      this.router.navigateByUrl('/join')
    }
  }

  ngOnInit(): void {

  }

}
