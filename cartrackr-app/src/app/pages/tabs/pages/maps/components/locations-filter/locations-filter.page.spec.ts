import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationsFilterPage } from './locations-filter.page';

describe('LocationsFilterPage', () => {
  let component: LocationsFilterPage;
  let fixture: ComponentFixture<LocationsFilterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocationsFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
