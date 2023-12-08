import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../alert.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { Alert } from '../../alert.types';

@Component({
  standalone: true,
  imports: [CommonModule, TextInputComponent, ReactiveFormsModule],
  templateUrl: './alert-create.component.html',
  styleUrls: ['./alert-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertCreateComponent {
  createForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
  });

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      console.log(id);

      if (!id) {
        return EMPTY;
      }
      return this.alertService.fetchDetail$(id);
    }),
    map((alert) => {
      this.createForm.patchValue(
        Object.keys(alert).reduce<{ [key: string]: unknown }>((acc, key) => {
          if (!this.createForm.contains(key)) {
            return acc;
          }
          acc[key] = alert[key as keyof Alert];
          return acc;
        }, {})
      );
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly alertService: AlertService,
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
    this.alertService.create$(this.createForm.getRawValue()).subscribe(() => {
      this.location.back();
    });
  }

  private update(id: string): void {
    this.alertService
      .update$(id, this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }
}
