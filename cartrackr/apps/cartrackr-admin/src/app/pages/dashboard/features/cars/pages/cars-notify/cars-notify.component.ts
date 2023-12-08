import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarsService } from '../../cars.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap, tap } from 'rxjs';
import { InputToggleComponent } from '../../../../../../shared/ui/form/input-toggle/input-toggle.component';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    InputToggleComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './cars-notify.component.html',
  styleUrls: ['./cars-notify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarsNotifyComponent {
  createForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
  });

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      if (!id) {
        return EMPTY;
      }
      return this.carsService.fetchDetail$(id);
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly carsService: CarsService,
    private readonly location: Location,
    private readonly route: ActivatedRoute
  ) {}

  onSubmitClick(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.notify(+this.route.snapshot.params['id']);
  }

  private notify(id: number): void {
    this.carsService
      .notify$(id, this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }
}
