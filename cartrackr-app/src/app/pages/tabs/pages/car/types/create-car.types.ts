import { DraftImage } from 'src/app/core/camera/types/image.types';
import { List } from 'src/app/shared/types/list.types';

export type CreateCar = {
  readonly licensePlate: string;
  readonly modelId: number;
  readonly fuelType: number;
  readonly brandId: number;
  readonly images: List<DraftImage>;
};
