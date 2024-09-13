import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMachineryFormComponent } from './plant-machinery-form.component';

describe('PlantMachineryFormComponent', () => {
  let component: PlantMachineryFormComponent;
  let fixture: ComponentFixture<PlantMachineryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantMachineryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantMachineryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
