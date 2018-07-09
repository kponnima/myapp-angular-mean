import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftCreateComponent } from './aircraft-create.component';

describe('AircraftCreateComponent', () => {
  let component: AircraftCreateComponent;
  let fixture: ComponentFixture<AircraftCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AircraftCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AircraftCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
