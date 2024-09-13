import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedOrderComponent } from './allocated-order.component';

describe('AllocatedOrderComponent', () => {
  let component: AllocatedOrderComponent;
  let fixture: ComponentFixture<AllocatedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatedOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
