import { Component, OnInit } from '@angular/core';
import { VolubleService } from '../voluble.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {
  isLoggedIn: boolean
  contacts: any[]
  constructor(private volubleSvc: VolubleService, private authSvc: AuthService) { }

  async ngOnInit() {
    this.authSvc.userOrg = "E9D6F7BD-978B-47ED-BBC9-368C958C280F"
    if (this.isLoggedIn) {
      this.volubleSvc.getContacts(this.authSvc.userOrg, this.authSvc.access_token)
        .subscribe(val => {
          this.contacts = Array.isArray(val.data) ? val.data : [val.data]
          return
        })
    }
  }

}
