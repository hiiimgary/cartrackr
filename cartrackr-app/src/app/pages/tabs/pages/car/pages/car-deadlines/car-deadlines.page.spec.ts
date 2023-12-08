import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarDeadlinesPage } from './car-deadlines.page';

describe('CarDeadlinesPage', () => {
  let component: CarDeadlinesPage;
  let fixture: ComponentFixture<CarDeadlinesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarDeadlinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
