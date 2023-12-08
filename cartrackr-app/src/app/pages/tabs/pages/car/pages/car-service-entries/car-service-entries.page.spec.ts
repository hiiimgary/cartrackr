import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarServiceEntriesPage } from './car-service-entries.page';

describe('CarServiceEntriesPage', () => {
  let component: CarServiceEntriesPage;
  let fixture: ComponentFixture<CarServiceEntriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarServiceEntriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
