import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { VolubleService } from 'src/app/voluble.service';
import { Auth0Service } from 'src/app/auth0.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
  public messages: Promise<any[]>
  constructor(private authSvc: AuthService, private volubleSvc: VolubleService,
    private auth0Svc: Auth0Service) { }

  ngOnInit(): void {
    this.messages = this.volubleSvc.getInboundMessages(this.authSvc.userOrg)
      .then(resp => {
        if (!(resp.data instanceof Array)) { resp.data = [resp.data] }
        return Promise.all(resp.data.map((val, _idx, _arr) => {
          return Promise.all([this.volubleSvc.getContact(this.authSvc.userOrg, val.relationships.contact.data.id),
          val.relationships.user.data.id ? this.auth0Svc.getUser(val.relationships.user.data.id) : void 0])
            .then(([contact, user]) => {
              val.relationships.contact.data = contact.data
              if (!user.name && user.given_name && user.family_name) { user.name = `${user.given_name} ${user.family_name}` }
              val.relationships.user.data['attributes'] = user
              return val
            })
            .catch(e => e)
        }))
      })
      .then(messagesOrErrs => {
        messagesOrErrs.forEach((val) => {
          if (val instanceof Error) { throw val }
        })
        return messagesOrErrs
      })
      .catch(e => {
        console.error(e)
        return Promise.resolve(e)
      })
  }

}
