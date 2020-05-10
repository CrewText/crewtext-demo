import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundMessagesComponent } from './inbound-messages.component';

describe('InboundMessagesComponent', () => {
  let component: InboundMessagesComponent;
  let fixture: ComponentFixture<InboundMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
