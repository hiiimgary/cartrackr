import { CarBrand } from '../../../../app.service';

export class CreateCarBrandDto implements CarBrand {
  name: string;
  models: { name: string }[];
  categories: {
    name: string;
    models: { name: string }[];
  }[];
}
