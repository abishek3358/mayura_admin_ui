import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisExpenseFormComponent } from './mis-expense-form.component';

describe('MisExpenseFormComponent', () => {
  let component: MisExpenseFormComponent;
  let fixture: ComponentFixture<MisExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisExpenseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
