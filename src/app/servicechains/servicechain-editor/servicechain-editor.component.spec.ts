import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicechainEditorComponent } from './servicechain-editor.component';

describe('ServicechainEditorComponent', () => {
  let component: ServicechainEditorComponent;
  let fixture: ComponentFixture<ServicechainEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicechainEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicechainEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
