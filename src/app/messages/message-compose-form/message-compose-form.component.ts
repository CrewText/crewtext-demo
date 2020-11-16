import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { VolubleService } from 'src/app/voluble.service';
import { Contact, Message } from 'voluble-common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-compose-form',
  templateUrl: './message-compose-form.component.html',
  styleUrls: ['./message-compose-form.component.css']
})
export class MessageComposeFormComponent implements OnInit, OnChanges {
  @Input() reply_to_message: Message;
  @Input() reply_to_contact: Contact

  constructor(private authSvc: AuthService, private volubleSvc: VolubleService, private router: Router) { }

  ngOnInit(): void {
    //@ts-ignore
    $('#message-form').form()
    //@ts-ignore
    $('#contacts-dropdown').dropdown()



    this.volubleSvc.contacts.getContacts(this.authSvc.userOrg)
      .then(contacts => {
        //@ts-ignore
        $('#contacts-dropdown').dropdown('setup menu', {
          values: contacts.data.map((contact, _idx, _arr) => {
            return { value: contact.id, text: contact.attributes.first_name + " " + contact.attributes.surname, name: contact.attributes.first_name + " " + contact.attributes.surname }
          })
        })
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.resetForm()
    for (const change in changes) {
      if (change == "reply_to_message" || change == "reply_to_contact") {
        this[change] = changes[change].currentValue
      }

      if (change == "reply_to_contact" && changes[change].currentValue) {
        //@ts-ignore
        $('#contacts-dropdown').dropdown('set selected', this.reply_to_contact.id)
      }
    }
  }

  async sendMessage(e) {
    e.preventDefault()
    //@ts-ignore
    let vals = $('#message-form').form('get values', ['contact', 'body'])
    //@ts-ignore
    $('#sendingDimmer').dimmer('show')

    Promise.all(vals['contact'].split(',').map(contact =>
      this.volubleSvc.messages.sendMessage(this.authSvc.userOrg, contact, vals['body'], this.reply_to_message ? this.reply_to_message.id : null)
    ))
      .then((messages_sent) => {
        this.router.navigateByUrl('/messages/sent')
      })
  }

  resetForm(): void {
    //@ts-ignore
    $('#sendingDimmer').dimmer('hide')
    //@ts-ignore
    $('#message-form').form('reset')
  }

}
