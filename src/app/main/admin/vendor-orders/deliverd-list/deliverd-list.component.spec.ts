import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverdListComponent } from './deliverd-list.component';

describe('DeliverdListComponent', () => {
  let component: DeliverdListComponent;
  let fixture: ComponentFixture<DeliverdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverdListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
