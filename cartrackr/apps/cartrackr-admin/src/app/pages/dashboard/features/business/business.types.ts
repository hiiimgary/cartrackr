export type BusinessListItem = {
  readonly id: number;
  readonly isActive: boolean;
  readonly name: string;
  readonly createdAt: string;
};

export type BusinessDetail = {
  readonly id: string;
  readonly name: string;
  readonly location: BusinessLocation;
  readonly contactInfo: BusinessContactInfo;
  readonly isActive: boolean;
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

export type BusinessContactInfo = {
  readonly email: string;
  readonly phone: string;
};
