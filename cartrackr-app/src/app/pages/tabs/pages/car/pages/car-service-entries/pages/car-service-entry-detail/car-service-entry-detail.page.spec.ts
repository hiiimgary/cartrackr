import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarServiceEntryDetailPage } from './car-service-entry-detail.page';

describe('CarServiceEntryDetailPage', () => {
  let component: CarServiceEntryDetailPage;
  let fixture: ComponentFixture<CarServiceEntryDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarServiceEntryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
