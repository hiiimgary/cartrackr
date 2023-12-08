import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarExpensesPage } from './car-expenses.page';

describe('CarExpensesPage', () => {
  let component: CarExpensesPage;
  let fixture: ComponentFixture<CarExpensesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarExpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
