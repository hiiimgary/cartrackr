import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessLoginPage } from './business-login.page';

describe('BusinessLoginPage', () => {
  let component: BusinessLoginPage;
  let fixture: ComponentFixture<BusinessLoginPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BusinessLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
