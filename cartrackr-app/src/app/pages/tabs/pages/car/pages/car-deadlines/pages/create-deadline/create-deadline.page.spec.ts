import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDeadlinePage } from './create-deadline.page';

describe('CreateDeadlinePage', () => {
  let component: CreateDeadlinePage;
  let fixture: ComponentFixture<CreateDeadlinePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateDeadlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
