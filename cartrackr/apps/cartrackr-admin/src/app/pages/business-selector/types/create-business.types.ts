export type CreateBusiness = {
  readonly name: string;
  readonly location: BusinessLocation;
  readonly contactInfo: BusinessContactInfo;
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
