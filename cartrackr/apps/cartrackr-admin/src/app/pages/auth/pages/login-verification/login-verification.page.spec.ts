import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginVerificationPage } from './login-verification.page';

describe('LoginVerificationPage', () => {
  let component: LoginVerificationPage;
  let fixture: ComponentFixture<LoginVerificationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginVerificationPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
