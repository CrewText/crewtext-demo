import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { VolubleService } from 'src/app/voluble.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  orgName: string;

  constructor(public authSvc: AuthService, public router: Router, public volubleSvc: VolubleService) {

    if (!this.authSvc.isLoggedIn) {
      this.authSvc.login();
    } else if (!this.authSvc.userOrg) {
      this.router.navigateByUrl('/join')
    }
  }

  async ngOnInit(): Promise<void> {
    this.volubleSvc.organizations.getOrg(this.authSvc.userOrg)
      .then(resp => { this.orgName = resp.data.attributes.name })
  }

}
