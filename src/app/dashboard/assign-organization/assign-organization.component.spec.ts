import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOrganizationComponent } from './assign-organization.component';

describe('AssignOrganizationComponent', () => {
  let component: AssignOrganizationComponent;
  let fixture: ComponentFixture<AssignOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
