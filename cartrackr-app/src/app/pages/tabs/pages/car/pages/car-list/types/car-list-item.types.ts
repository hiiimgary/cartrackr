import { ImageResponse } from '../../../../../../../../../../cartrackr/libs/cartrackr-shared/src/lib/model/image-response';

export type CarListItem = {
  readonly id: number;
  readonly licensePlate: string;
  readonly thumbnail: ImageResponse | null;
};
