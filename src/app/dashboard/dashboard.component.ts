import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { VolubleService } from '../voluble.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authSvc: AuthService, private volubleSvc: VolubleService) { }

  messagesToday: number
  ngOnInit(): void {
    let today_start: Date = new Date(new Date().setHours(0, 0, 0, 0))
    this.volubleSvc.getMessageCount(this.authSvc.userOrg, today_start)
      .subscribe((resp) => {
        this.messagesToday = resp.data.count
      })
  }

}
