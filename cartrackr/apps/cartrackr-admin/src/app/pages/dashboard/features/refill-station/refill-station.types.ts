export type RefillStation = {
  readonly id: number;

  readonly name: string;
  readonly location: BusinessLocation;
};

export type BusinessLocation = {
  readonly latitude: string;
  readonly longitude: string;
  readonly country: string;
  readonly zipCode: string;
  readonly city: string;
  readonly street: string;
  readonly streetNumber: string;
};
