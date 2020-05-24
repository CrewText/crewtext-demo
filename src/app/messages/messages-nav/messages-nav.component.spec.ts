import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesNavComponent } from './messages-nav.component';

describe('MessagesNavComponent', () => {
  let component: MessagesNavComponent;
  let fixture: ComponentFixture<MessagesNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
