import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateExpensePage } from './create-expense.page';

describe('CreateExpensePage', () => {
  let component: CreateExpensePage;
  let fixture: ComponentFixture<CreateExpensePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
