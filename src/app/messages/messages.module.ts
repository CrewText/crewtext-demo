import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { MessageComposeComponent } from './message-compose/message-compose.component';
import { MessageComposeFormComponent } from './message-compose-form/message-compose-form.component';
import { InboundMessagesComponent } from './inbound-messages/inbound-messages.component';
import { ThreadComponent } from './thread/thread.component';
import { OutboundMessagesComponent } from './outbound-messages/outbound-messages.component';
import { MessagesNavComponent } from './messages-nav/messages-nav.component';


@NgModule({
  declarations: [MessagesListComponent, MessageComposeComponent, MessageComposeFormComponent, InboundMessagesComponent, ThreadComponent, OutboundMessagesComponent, MessagesNavComponent],
  imports: [
    CommonModule,
    MessagesRoutingModule
  ]
})
export class MessagesModule { }
