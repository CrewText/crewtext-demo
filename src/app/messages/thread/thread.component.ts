import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesListComponent } from '../messages-list/messages-list.component';
import { Contact, Message } from 'voluble-common';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, AfterViewInit {
  compose_form_replyto_message: Message
  compose_form_replyto_contact: Contact

  @ViewChild(MessagesListComponent) list: MessagesListComponent

  constructor(public route: ActivatedRoute) { }

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
