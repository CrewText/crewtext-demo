import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { VolubleService } from '../../voluble.service';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  constructor(public authSvc: AuthService, private volubleSvc: VolubleService) { }

  messagesToday: number

  async ngOnInit(): Promise<void> {
    let today_start: Date = new Date(new Date().setHours(0, 0, 0, 0))

    this.messagesToday = await this.volubleSvc.messages.getMessageCount(this.authSvc.userOrg, today_start)
      .then(resp => resp.data.count)
  }

}
