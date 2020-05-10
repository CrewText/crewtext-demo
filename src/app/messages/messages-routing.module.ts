import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { InboundMessagesComponent } from './inbound-messages/inbound-messages.component';
import { ThreadComponent } from './thread/thread.component';
import { MessageComposeComponent } from './message-compose/message-compose.component';
import { OutboundMessagesComponent } from './outbound-messages/outbound-messages.component';


const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'thread/:id',
        component: ThreadComponent
      },
      {
        path: 'compose',
        component: MessageComposeComponent
      },
      {
        path: 'received',
        component: InboundMessagesComponent
      },
      {
        path: 'sent',
        component: OutboundMessagesComponent
      },
      {
        'path': '',
        pathMatch: 'full',
        redirectTo: 'received'
      },
      // {
      // path:'compose':
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
