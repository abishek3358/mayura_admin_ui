import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SacCodeComponent } from './sac-code.component';

describe('SacCodeComponent', () => {
  let component: SacCodeComponent;
  let fixture: ComponentFixture<SacCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SacCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SacCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
