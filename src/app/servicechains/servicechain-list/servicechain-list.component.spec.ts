import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicechainListComponent } from './servicechain-list.component';

describe('ServicechainListComponent', () => {
  let component: ServicechainListComponent;
  let fixture: ComponentFixture<ServicechainListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicechainListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicechainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
