import { ImageResponse } from './image-response';

export interface ModifyCar {
  readonly id: number;
  readonly licensePlate: string;
  readonly modelId: number;
}

export interface CreateCar {
  readonly licensePlate: string;
  readonly modelId: number;
  readonly brandId: number;
  readonly fuelType: number;
}

export interface CarResponse {
  readonly id: number;
  readonly licensePlate: string;
  readonly model: CarModel;
  readonly brand: {
    readonly id: number;
    readonly name: string;
  };
  readonly fuelType: number;
  readonly qrCode: string;
  readonly images: ImageResponse[];
  readonly expenses: Expense[];
  readonly alerts: Alert[];
  readonly deadlines: Deadline[];
  readonly businesses: BusinessCar[];
}

export interface BusinessCar {
  readonly businessCarId: number;
  readonly businessId: number;
  readonly isAccessGranted: boolean;
  readonly createdAt: Date;
  readonly businessName: string;
}

export interface Expense {
  readonly id: number;
  readonly date: Date;
  readonly price: number;
  readonly title: string;
  readonly expenseCategory: {
    readonly id: number;
    readonly slug: string;
    readonly name: string;
  };
  readonly refill: {
    readonly id: number;
    readonly mileage: number;
    readonly amount: number;
    readonly isFull: boolean;
  } | null;
  readonly serviceEntry: {
    readonly id: number;
    readonly businessId: number;
    readonly description: string;
  } | null;
}

export interface Alert {
  readonly id: number;
  readonly licensePlate: string;
  readonly createdAt: Date;
  readonly isResolved: boolean;
  readonly isArchived: boolean;
  readonly alertType: {
    readonly id: number;
    readonly title: string;
  };
}

export interface Deadline {
  readonly id: number;
  readonly title: string;
  readonly createdAt: Date;
  readonly deadline: Date;
  readonly isDone: boolean;
}

export interface CarBrand {
  readonly id: number;
  readonly name: string;
  readonly models: CarModel[];
  readonly categories: CarModelCategory[];
}

export interface CarModel {
  readonly id: number;
  readonly name: string;
}

export interface CarModelCategory {
  readonly id: number;
  readonly name: string;
  readonly models: CarModel[];
}

export interface BusinessCarListResponse {
  readonly businessCarId: number;
  readonly id: number;
  readonly addedAt: Date;
  readonly licensePlate: string;
  readonly model: CarModel;
  readonly brand: {
    readonly id: number;
    readonly name: string;
  };
  readonly fuelType: number;
  readonly images: ImageResponse[];
}

export interface BusinessCarDetailResponse extends BusinessCarListResponse {
  readonly businessCarId: number;
  readonly id: number;
  readonly addedAt: Date;
  readonly licensePlate: string;
  readonly model: CarModel;
  readonly brand: {
    readonly id: number;
    readonly name: string;
  };
  readonly fuelType: number;
  readonly images: ImageResponse[];
  readonly serviceEntries: BusinessCarServiceEntry[];
}

export interface BusinessCarServiceEntry {
  readonly businessId: number;
  readonly serviceEntryId: number;
  readonly expenseId: number;
  readonly isFinalized: boolean;
  readonly isEditable: boolean;
  readonly price: number;
  readonly title: string;
  readonly date: Date;
  readonly description: string;
  readonly images: ImageResponse[];
}
