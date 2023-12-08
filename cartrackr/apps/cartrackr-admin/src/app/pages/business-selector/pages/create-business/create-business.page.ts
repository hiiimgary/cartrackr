import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../shared/ui/form/text-input/text-input.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';
import { BehaviorSubject } from 'rxjs';
import { BusinessSelectorService } from '../../services/business-selector.service';
import { CreateBusiness } from '../../types/create-business.types';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TextInputComponent,
    AlertComponent,
  ],
  templateUrl: './create-business.page.html',
  styleUrls: ['./create-business.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBusinessPage {
  createBusinessForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
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

  errorMsg$ = new BehaviorSubject<string>('');
  isSuccess$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly businessSelectorService: BusinessSelectorService,
    private readonly fb: FormBuilder
  ) {
    this.createBusinessForm.patchValue({
      name: 'Test Business',
      location: {
        latitude: '49.234',
        longitude: '18.345',
        country: 'Test Country',
        zipCode: '12345',
        city: 'Test City',
        street: 'Test Street',
        streetNumber: '123',
      },
      contactInfo: {
        email: 'asd@asd.asd',
        phone: '+36304868074',
      },
    });
  }

  onCreateBusinessClick(): void {
    if (!this.createBusinessForm.valid) {
      return;
    }

    const form = this.createBusinessForm.getRawValue();

    const payload: CreateBusiness = {
      ...form,
      location: {
        ...form.location,
      },
    };

    this.businessSelectorService.createBusiness$(payload).subscribe({
      next: () => {
        this.isSuccess$.next(true);
        this.errorMsg$.next('');
      },
      error: (err) => {
        this.isSuccess$.next(false);
        this.errorMsg$.next(err.message);
      },
    });
  }
}
