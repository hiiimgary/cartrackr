import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCarPage } from './create-car.page';

describe('CreateCarPage', () => {
  let component: CreateCarPage;
  let fixture: ComponentFixture<CreateCarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
