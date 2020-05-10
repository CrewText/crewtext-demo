import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageComposeFormComponent } from '../message-compose-form/message-compose-form.component';

@Component({
  selector: 'app-message-compose',
  templateUrl: './message-compose.component.html',
  styleUrls: ['./message-compose.component.css']
})
export class MessageComposeComponent implements OnInit {

  //@ViewChild(MessageComposeFormComponent)
  constructor() { }

  ngOnInit(): void {
  }

}
