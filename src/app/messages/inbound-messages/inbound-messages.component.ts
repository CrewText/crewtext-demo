import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Contact, Message } from 'voluble-common';
import { MessagesListComponent } from '../messages-list/messages-list.component';

@Component({
  selector: 'app-inbound-messages',
  templateUrl: './inbound-messages.component.html',
  styleUrls: ['./inbound-messages.component.css']
})
export class InboundMessagesComponent implements OnInit, AfterViewInit {
  compose_form_replyto_message: Message
  compose_form_replyto_contact: Contact

  @ViewChild(MessagesListComponent) private list: MessagesListComponent;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.list.replyEvents.subscribe((val => {
      let data: { message: Message, contact: Contact } = JSON.parse(val)
      this.compose_form_replyto_contact = data.contact
      this.compose_form_replyto_message = data.message
      //@ts-ignore
      $('#compose-modal').modal('show')
    }))

  }

}
