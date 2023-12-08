import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RefillStationService } from '../../refill-station.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { RefillStation } from '../../refill-station.types';

@Component({
  standalone: true,
  imports: [CommonModule, TextInputComponent, ReactiveFormsModule],
  templateUrl: './refill-station-create.component.html',
  styleUrls: ['./refill-station-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefillStationCreateComponent {
  createForm = this.fb.nonNullable.group({
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
  });

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      if (!id) {
        return EMPTY;
      }
      return this.refillStationService.fetchDetail$(id);
    }),
    map((refillStation) => {
      this.createForm.patchValue(
        Object.keys(refillStation).reduce<{ [key: string]: unknown }>(
          (acc, key) => {
            if (!this.createForm.contains(key)) {
              return acc;
            }
            acc[key] = refillStation[key as keyof RefillStation];
            return acc;
          },
          {}
        )
      );
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly refillStationService: RefillStationService,
    private readonly location: Location,
    private readonly route: ActivatedRoute
  ) {}

  onSubmitClick(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.params['id'];

    id ? this.update(id) : this.create();
  }

  private create(): void {
    this.refillStationService
      .create$(this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }

  private update(id: string): void {
    this.refillStationService
      .update$(id, this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }
}
