export enum CarDetailType {
  BRAND = 'brand',
  CATEGORY = 'category',
  MODEL = 'model',
  MODEL_WITH_CATEGORY = 'model-with-category',
}

export type DetailIds = {
  brandId: string | null;
  categoryId: string | null;
  modelId: string | null;
};
