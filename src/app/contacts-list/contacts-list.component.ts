import { Component, OnInit } from '@angular/core';
import { VolubleService } from '../voluble.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {
  isLoggedIn = this.authSvc.isLoggedIn
  contacts: any[]
  constructor(private volubleSvc: VolubleService, public authSvc: AuthService) { }

  async ngOnInit() {
    console.log(this.authSvc.isLoggedIn)
    this.authSvc.userOrg = "E9D6F7BD-978B-47ED-BBC9-368C958C280F"
    if (this.authSvc.isLoggedIn) {
      this.volubleSvc.getContacts(this.authSvc.userOrg, this.authSvc.jwt)
        .subscribe(val => {
          this.contacts = Array.isArray(val.data) ? val.data : [val.data]
          return
        })
    }
  }

  deleteContact(contact_id: string) {
  }

}
