import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundMessagesComponent } from './outbound-messages.component';

describe('OutboundMessagesComponent', () => {
  let component: OutboundMessagesComponent;
  let fixture: ComponentFixture<OutboundMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
