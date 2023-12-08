import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';

const CAR_MODELS_ENDPOINT = `https://api.hasznaltauto.hu/v2/tomb/markakSzemelyautoFilter,modellekSzemelyautoFilter`;

type CarModelsResponse = {
  readonly markakSzemelyautoFilter: readonly {
    readonly k: number;
    readonly v: string;
  }[];
  readonly modellekSzemelyautoFilter: readonly {
    readonly k: number;
    readonly i: readonly {
      readonly k: number;
      readonly v: string;
      readonly i: readonly {
        readonly k: number;
        readonly v: string;
      }[];
    }[];
  }[];
};

export interface CarBrand {
  name: string;
  models: {
    name: string;
  }[];

  categories: {
    name: string;
    models: {
      name: string;
    }[];
  }[];
}

@Injectable()
export class AppService {
  constructor(private readonly http: HttpService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getCarModels(): Observable<CarBrand[]> {
    return this.http.get<CarModelsResponse>(CAR_MODELS_ENDPOINT).pipe(
      map((res) => res.data),
      map((data) => {
        const brands = data.markakSzemelyautoFilter.map((brand) => {
          const models = data.modellekSzemelyautoFilter
            .find((m) => m.k === brand.k)
            ?.i.map((m) => ({
              // Remove the parenthesis from the model name
              name: this.formatText(m.v),
              subtypes: m.i?.map((s) => ({ name: this.formatText(s.v) })) || [],
            }));
          return { name: this.formatText(brand.v), models };
        });

        const mappedBrands: CarBrand[] = brands.map((b) => ({
          name: b.name,
          models:
            b.models
              ?.filter((m) => m.subtypes.length === 0)
              .map((m) => ({ name: m.name })) || [],
          categories:
            b.models
              ?.filter((m) => m.subtypes.length > 0)
              .map((c) => ({ name: c.name, models: c.subtypes })) || [],
        }));

        return mappedBrands;
      })
    );
  }

  private formatText(str: string): string {
    const lowerString = str.replace(/ *\([^)]*\) */g, '').toLowerCase();

    // capitalize the first letter of every word in string and capitalize roman numerals
    return lowerString
      .split(' ')
      .map((word) => {
        if (word.match(/^[ivx]+$/i)) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}
