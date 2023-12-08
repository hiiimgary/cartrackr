import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthBasePage } from './auth-base.page';

describe('AuthBasePage', () => {
  let component: AuthBasePage;
  let fixture: ComponentFixture<AuthBasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthBasePage],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthBasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
