import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisExpenseComponent } from './mis-expense.component';

describe('MisExpenseComponent', () => {
  let component: MisExpenseComponent;
  let fixture: ComponentFixture<MisExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisExpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
