import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubControrBoqTableComponent } from './sub-contror-boq-table.component';

describe('SubControrBoqTableComponent', () => {
  let component: SubControrBoqTableComponent;
  let fixture: ComponentFixture<SubControrBoqTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubControrBoqTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubControrBoqTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
