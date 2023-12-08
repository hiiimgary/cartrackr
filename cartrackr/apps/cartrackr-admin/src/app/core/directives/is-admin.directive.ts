import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../../pages/auth/services/auth.service';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  combineLatestWith,
  takeUntil,
} from 'rxjs';

@Directive({
  selector: '[appIsAdmin]',
  standalone: true,
})
export class IsAdminDirective implements OnDestroy, OnInit {
  @Input({ required: true }) set appIsAdmin(value: boolean) {
    this.isAdmin$.next(value);
  }

  private readonly isAdmin$ = new BehaviorSubject<boolean>(false);

  private readonly destroy$ = new Subject<void>();

  private rendered = false;

  constructor(
    private readonly authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    combineLatest([this.authService.userData$, this.isAdmin$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([userData, isAdmin]) => {
        if (!isAdmin) {
          if (this.rendered) {
            return;
          }
          this.rendered = true;
          this.viewContainer.createEmbeddedView(this.templateRef);
          return;
        }
        if (userData?.user.isAdmin && isAdmin) {
          if (this.rendered) {
            return;
          }
          this.rendered = true;
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          if (!this.rendered) {
            return;
          }
          this.rendered = false;
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
