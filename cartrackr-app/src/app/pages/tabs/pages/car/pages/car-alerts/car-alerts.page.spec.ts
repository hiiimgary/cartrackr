import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarAlertsPage } from './car-alerts.page';

describe('CarAlertsPage', () => {
  let component: CarAlertsPage;
  let fixture: ComponentFixture<CarAlertsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarAlertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
