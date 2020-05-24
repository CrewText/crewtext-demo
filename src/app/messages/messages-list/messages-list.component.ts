import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Auth0Service } from 'src/app/auth0.service';
import { VolubleService } from 'src/app/voluble.service';
import { MessageDirections } from 'voluble-common';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {
  public messages: any[];
  @Input() public direction: MessageDirections;
  @Input() public thread_root_message_id: string
  public replyEvents = new EventEmitter(true);

  is_reply_formatted(direction: MessageDirections) {
    console.log(direction)
    return {
      floated: direction = MessageDirections.INBOUND,
      right: direction = MessageDirections.INBOUND
    }
  }

  constructor(private authSvc: AuthService, private volubleSvc: VolubleService,
    private auth0Svc: Auth0Service) { }

  async ngOnInit(): Promise<void> {
    if (!this.thread_root_message_id) {
      this.messages = await this.volubleSvc.getMessages(this.authSvc.userOrg, this.direction)
        .then(resp => {
          if (!(resp.data instanceof Array)) { resp.data = [resp.data] }
          return Promise.all(resp.data.map((val, _idx, _arr) => {
            return Promise.all([this.volubleSvc.getContact(this.authSvc.userOrg, val.relationships.contact.data.id),
            val.relationships.user.data.id ? this.auth0Svc.getUser(this.authSvc.userOrg, val.relationships.user.data.id, this.authSvc.jwt) : void 0])
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
    } else {
      this.messages = await this.volubleSvc.getMessage(this.authSvc.userOrg, this.thread_root_message_id)
        .then(async msg => {
          let messages = [msg.data]
          let repliesToProcess = await this.volubleSvc.getMessageReplies(this.authSvc.userOrg, messages[messages.length - 1].id)
            .then(replies => { return replies.data })
          messages.push(...repliesToProcess)
          while (repliesToProcess.length) {
            //console.log(repliesToProcess)
            await this.volubleSvc.getMessageReplies(this.authSvc.userOrg, repliesToProcess[0].id)
              .then(replies => { repliesToProcess.push(...replies.data); messages.push(...replies.data) })
              .then(() => { repliesToProcess.splice(0, 1); })
          }

          return Promise.all(messages.map((val, _idx, _arr) => {
            return Promise.all([this.volubleSvc.getContact(this.authSvc.userOrg, val.relationships.contact.data.id),
            val.relationships.user.data.id ? this.auth0Svc.getUser(this.authSvc.userOrg, val.relationships.user.data.id, this.authSvc.jwt) : void 0])
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
    }
  }

  onReply($event: MouseEvent, message_id: string) {
    //this.messages.then(msgs => {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    for (const message of this.messages) {
      if (message.id == message_id) {
        this.replyEvents.emit(JSON.stringify({
          message: {
            id: message_id,
            body: message.attributes.body,
            ...message.attributes
          },
          contact: {

            id: message.relationships.contact.data.id,
            ...message.relationships.contact.data.attributes
          }
        }));
        break
      }
    }
    //})

  }

}
