import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarTypesService } from '../../car-types.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  map,
  startWith,
  switchMap,
} from 'rxjs';
import {
  CarBrand,
  CarModel,
  CarModelCategory,
} from '@cartrackr/cartrackr-shared';
import { tableComponentImports } from '@cartrackr/ng-table';
import { DetailHeaderComponent } from '../../../../ui/detail-header/detail-header.component';
import { CarDetailType, DetailIds } from '../../car-types.types';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    ReactiveFormsModule,
    DetailHeaderComponent,
    ...tableComponentImports,
    RouterModule,
  ],
  templateUrl: './car-types-create.component.html',
  styleUrls: ['./car-types-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarTypesCreateComponent {
  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
  });

  readonly isNew$ = this.route.data.pipe(map((data) => data['isCreate']));
  readonly type$ = this.route.data.pipe(
    map((data) => data['type'] as CarDetailType)
  );

  readonly carDetailType = CarDetailType;

  readonly detail$ = this.route.params
    .pipe(
      map((params) => {
        const ids = {
          brandId: params['id'] || null,
          categoryId: params['categoryId'] || null,
          modelId: params['modelId'] || null,
        };

        return ids;
      })
    )
    .pipe(
      switchMap((ids) =>
        this.route.data.pipe(
          map((data) => {
            return {
              ids,
              data: {
                type: data['type'],
                isCreate: data['isCreate'],
              },
            };
          })
        )
      ),
      switchMap(({ ids, data }) => {
        if (data.isCreate) {
          return EMPTY;
        }

        return this.fetchDetail$(data.type, ids).pipe(
          map((carType) => {
            this.createForm.patchValue({ name: carType.name });

            if (data['type'] === CarDetailType.BRAND) {
              this.categoryListSubject.next((carType as CarBrand).categories);
              this.modelListSubject.next((carType as CarBrand).models);
            }

            if (data['type'] === CarDetailType.CATEGORY) {
              this.modelListSubject.next((carType as CarModelCategory).models);
            }
          })
        );
      })
    );

  private readonly categoryListSubject = new BehaviorSubject<
    CarModelCategory[]
  >([]);
  private readonly modelListSubject = new BehaviorSubject<CarModel[]>([]);

  private readonly refreshCategoriesSubject = new Subject<void>();
  private readonly refreshModelsSubject = new Subject<void>();
  private readonly filterCategoriesSubject = new Subject<string>();
  private readonly filterModelsSubject = new Subject<string>();

  readonly propsToFilterCategory: (keyof CarModelCategory)[] = ['name', 'id'];
  readonly propsToFilterModel: (keyof CarModel)[] = ['name', 'id'];

  readonly categoryList$ = this.refreshCategoriesSubject.asObservable().pipe(
    map(() => null),
    startWith(null),
    switchMap(() => this.categoryListSubject.asObservable()),
    switchMap((list) => {
      return this.filterCategoriesSubject.asObservable().pipe(
        startWith(''),
        map((filter) => {
          if (!filter) {
            return list;
          }
          return list.filter((item) => {
            return this.propsToFilterCategory.reduce((acc, key) => {
              if (acc) {
                return true;
              }
              return `${item[key as keyof CarModelCategory]}`
                .toLowerCase()
                .includes(filter.toLowerCase());
            }, false);
          });
        })
      );
    })
  );

  readonly modelList$ = this.refreshModelsSubject.asObservable().pipe(
    map(() => null),
    startWith(null),
    switchMap(() => this.modelListSubject.asObservable()),
    switchMap((list) => {
      return this.filterModelsSubject.asObservable().pipe(
        startWith(''),
        map((filter) => {
          if (!filter) {
            return list;
          }
          return list.filter((item) => {
            return this.propsToFilterModel.reduce((acc, key) => {
              if (acc) {
                return true;
              }
              return `${item[key as keyof CarModel]}`
                .toLowerCase()
                .includes(filter.toLowerCase());
            }, false);
          });
        })
      );
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly carTypesService: CarTypesService,
    private readonly location: Location,
    private readonly route: ActivatedRoute
  ) {}

  fetchDetail$(
    type: CarDetailType,
    ids: DetailIds
  ): Observable<CarBrand | CarModel | CarModelCategory> {
    switch (type) {
      case CarDetailType.BRAND:
        return this.carTypesService.fetchBrandDetail$(ids);
      case CarDetailType.CATEGORY:
        return this.carTypesService.fetchCategoryDetail$(ids);
      case CarDetailType.MODEL:
        return this.carTypesService.fetchModelDetail$(ids);
      case CarDetailType.MODEL_WITH_CATEGORY:
        return this.carTypesService.fetchModelWithCategoryDetail$(ids);
    }
  }

  onSubmitClick(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const ids: DetailIds = {
      brandId: this.route.snapshot.params['id'],
      categoryId: this.route.snapshot.params['categoryId'],
      modelId: this.route.snapshot.params['modelId'],
    };

    const type = this.route.snapshot.data['type'] as CarDetailType;

    this.route.snapshot.data['isCreate']
      ? this.create(ids, type)
      : this.update(ids, type);
  }

  private create(ids: DetailIds, type: CarDetailType): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.createForm.getRawValue();

    let request$;

    switch (type) {
      case CarDetailType.BRAND:
        request$ = this.carTypesService.createBrand$(payload);
        break;
      case CarDetailType.CATEGORY:
        request$ = this.carTypesService.createCategory$(payload, ids);
        break;
      case CarDetailType.MODEL:
        request$ = this.carTypesService.createModel$(payload, ids);
        break;
      case CarDetailType.MODEL_WITH_CATEGORY:
        request$ = this.carTypesService.createModelWithCategory$(payload, ids);
        break;
    }

    request$.subscribe(() => {
      this.location.back();
    });
  }

  private update(ids: DetailIds, type: CarDetailType): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.createForm.getRawValue();

    let request$;

    switch (type) {
      case CarDetailType.BRAND:
        request$ = this.carTypesService.updateBrand$(ids, payload);
        break;
      case CarDetailType.CATEGORY:
        request$ = this.carTypesService.updateCategory$(ids, payload);
        break;
      case CarDetailType.MODEL:
        request$ = this.carTypesService.updateModel$(ids, payload);
        break;
      case CarDetailType.MODEL_WITH_CATEGORY:
        request$ = this.carTypesService.updateModelWithCategory$(ids, payload);
        break;
    }

    request$.subscribe(() => {
      this.location.back();
    });
  }

  onDeleteCategory(id: number): void {
    const ids: DetailIds = {
      brandId: this.route.snapshot.params['id'],
      categoryId: `${id}`,
      modelId: null,
    };
    this.carTypesService.deleteCategory$(ids).subscribe(() => {
      this.refreshCategoriesSubject.next();
    });
  }

  onFilterCategories(value: string): void {
    this.filterCategoriesSubject.next(value);
  }

  onDeleteModel(id: number): void {
    const ids: DetailIds = {
      brandId: this.route.snapshot.params['id'],
      categoryId: this.route.snapshot.params['categoryId'],
      modelId: `${id}`,
    };
    if (
      this.route.snapshot.data['type'] === CarDetailType.MODEL_WITH_CATEGORY
    ) {
      this.carTypesService.deleteModelWithCategory$(ids).subscribe(() => {
        this.refreshModelsSubject.next();
      });
      return;
    }

    this.carTypesService.deleteModel$(ids).subscribe(() => {
      this.refreshCategoriesSubject.next();
    });
  }

  onFilterModels(value: string): void {
    this.filterModelsSubject.next(value);
  }
}
