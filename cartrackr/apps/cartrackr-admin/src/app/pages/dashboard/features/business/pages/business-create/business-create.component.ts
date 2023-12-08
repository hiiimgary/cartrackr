import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../../business.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, EMPTY, map, switchMap, tap } from 'rxjs';
import { BusinessDetail } from '../../business.types';
import { InputToggleComponent } from '../../../../../../shared/ui/form/input-toggle/input-toggle.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    ReactiveFormsModule,
    InputToggleComponent,
  ],
  templateUrl: './business-create.component.html',
  styleUrls: ['./business-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessCreateComponent {
  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    isActive: [false, [Validators.required]],
    location: this.fb.nonNullable.group({
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      streetNumber: ['', [Validators.required]],
    }),
    contactInfo: this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    }),
  });

  isActive$ = new BehaviorSubject<boolean>(false);

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      if (!id) {
        return EMPTY;
      }
      return this.businessService.fetchDetail$(id);
    }),
    tap((business) => {
      this.isActive$.next(business.isActive);
      this.createForm.patchValue(
        Object.keys(business).reduce<{ [key: string]: unknown }>((acc, key) => {
          if (!this.createForm.contains(key)) {
            return acc;
          }
          acc[key] = business[key as keyof BusinessDetail];
          return acc;
        }, {})
      );
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly businessService: BusinessService,
    private readonly location: Location,
    private readonly route: ActivatedRoute
  ) {}

  onSubmitClick(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.params['id'];

    this.update(id);
  }

  onActivate() {
    const id = this.route.snapshot.params['id'];

    this.businessService.activate$(id).subscribe(() => {
      this.location.back();
    });
  }

  private update(id: string): void {
    this.businessService
      .update$(id, this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }
}
