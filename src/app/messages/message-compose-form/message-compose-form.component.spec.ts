import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageComposeFormComponent } from './message-compose-form.component';

describe('MessageComposeFormComponent', () => {
  let component: MessageComposeFormComponent;
  let fixture: ComponentFixture<MessageComposeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComposeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComposeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
